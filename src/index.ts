import { decryptValue, randomToken, sha256Base64Url } from './crypto';
import { decodeIntegrityToken, markDeviceMigrationIssued } from './google-play';
import type { Env, MigrationRow, Platform, PromoCodeRow } from './types';
import {
  assertEligibleVerdict,
  isMigrationToken,
  isPlatform,
  isRequestId,
  requestHashFor,
} from './validation';

const apiPrefix = '/white_goat/migration/v1/migration/';
const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};
const productId = 'full_unlock';
const tokenLifetimeMillis = 15 * 60 * 1000;

class ApiError extends Error {
  constructor(readonly code: string, readonly status: number) {
    super(code);
  }
}

function response(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) return response({ error: error.code }, error.status);
  if (error instanceof Error && error.message === 'INELIGIBLE') {
    return response({ error: 'ineligible' }, 403);
  }
  return response({ error: 'temporarily_unavailable' }, 503);
}

async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    throw new ApiError('invalid_request', 400);
  }
  const length = Number(request.headers.get('content-length') ?? '0');
  if (!Number.isFinite(length) || length > 16 * 1024) throw new ApiError('invalid_request', 400);
  const raw = await request.text();
  if (raw.length === 0 || raw.length > 16 * 1024) throw new ApiError('invalid_request', 400);
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') throw new Error();
    return parsed as Record<string, unknown>;
  } catch {
    throw new ApiError('invalid_request', 400);
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function isCodeExpired(code: PromoCodeRow): boolean {
  return Number.isNaN(Date.parse(code.expires_at)) || Date.parse(code.expires_at) <= Date.now();
}

async function findMigrationByRequestId(env: Env, requestIdHash: string): Promise<MigrationRow | null> {
  return env.MIGRATION_DB.prepare(
    'SELECT * FROM migration_requests WHERE request_id_hash = ? LIMIT 1',
  ).bind(requestIdHash).first<MigrationRow>();
}

async function findCodeForMigration(env: Env, migrationId: string): Promise<PromoCodeRow | null> {
  return env.MIGRATION_DB.prepare(
    'SELECT * FROM promo_codes WHERE migration_id = ? LIMIT 1',
  ).bind(migrationId).first<PromoCodeRow>();
}

async function getOrCreateMigration(
  env: Env,
  requestIdHash: string,
  platform: Platform,
): Promise<MigrationRow> {
  const existing = await findMigrationByRequestId(env, requestIdHash);
  if (existing) {
    if (existing.target_platform !== platform) throw new ApiError('invalid_request', 400);
    return existing;
  }
  const timestamp = nowIso();
  const id = crypto.randomUUID();
  await env.MIGRATION_DB.prepare(
    `INSERT OR IGNORE INTO migration_requests
      (id, request_id_hash, target_platform, state, created_at, updated_at)
      VALUES (?, ?, ?, 'pending', ?, ?)`,
  ).bind(id, requestIdHash, platform, timestamp, timestamp).run();
  const created = await findMigrationByRequestId(env, requestIdHash);
  if (!created) throw new Error('Unable to create migration request.');
  return created;
}

async function allocateCode(env: Env, migration: MigrationRow): Promise<PromoCodeRow> {
  const existing = await findCodeForMigration(env, migration.id);
  if (existing) {
    if (isCodeExpired(existing)) throw new ApiError('inventory_exhausted', 409);
    return existing;
  }

  const allocated = await env.MIGRATION_DB.prepare(
    `UPDATE promo_codes
       SET status = 'assigned', migration_id = ?, assigned_at = ?
       WHERE id = (
         SELECT id FROM promo_codes
         WHERE platform = ? AND product_id = ? AND status = 'available' AND expires_at > ?
         ORDER BY expires_at ASC, created_at ASC
         LIMIT 1
       ) AND status = 'available'
       RETURNING *`,
  ).bind(migration.id, nowIso(), migration.target_platform, productId, nowIso()).first<PromoCodeRow>();
  if (!allocated) throw new ApiError('inventory_exhausted', 409);
  await env.MIGRATION_DB.prepare(
    `UPDATE migration_requests SET code_id = ?, state = 'recall_pending', updated_at = ? WHERE id = ?`,
  ).bind(allocated.id, nowIso(), migration.id).run();
  return allocated;
}

async function issueAndroidToken(env: Env, migration: MigrationRow): Promise<{ token: string; expiresAt: string }> {
  const token = randomToken();
  const hash = await sha256Base64Url(token);
  const expiresAt = new Date(Date.now() + tokenLifetimeMillis).toISOString();
  await env.MIGRATION_DB.prepare(
    `UPDATE migration_requests
       SET migration_token_hash = ?, token_expires_at = ?, updated_at = ?
       WHERE id = ?`,
  ).bind(hash, expiresAt, nowIso(), migration.id).run();
  return { token, expiresAt };
}

async function handleIssue(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  const integrityToken = body.integrity_token;
  const platform = body.target_platform;
  const requestId = body.request_id;
  if (typeof integrityToken !== 'string' || integrityToken.length < 20 || !isPlatform(platform) || !isRequestId(requestId)) {
    throw new ApiError('invalid_request', 400);
  }

  const expectedRequestHash = await requestHashFor(requestId, platform);
  const requestIdHash = await sha256Base64Url(requestId);
  const existing = await findMigrationByRequestId(env, requestIdHash);
  const verdict = await decodeIntegrityToken(env, integrityToken);
  assertEligibleVerdict(
    verdict,
    env,
    expectedRequestHash,
    existing != null && existing.target_platform === platform,
  );
  const migration = await getOrCreateMigration(env, requestIdHash, platform);
  await allocateCode(env, migration);

  if (migration.state !== 'issued') {
    await markDeviceMigrationIssued(env, integrityToken);
    await env.MIGRATION_DB.prepare(
      `UPDATE migration_requests SET state = 'issued', updated_at = ? WHERE id = ?`,
    ).bind(nowIso(), migration.id).run();
  }

  if (platform === 'ios') {
    const code = await findCodeForMigration(env, migration.id);
    if (!code) throw new Error('Migration code is missing.');
    const redemptionUrl = await decryptValue(code.value_ciphertext, code.value_iv, env.PROMO_CODE_ENCRYPTION_KEY);
    const uri = new URL(redemptionUrl);
    if (uri.protocol !== 'https:' || uri.hostname !== 'apps.apple.com') throw new Error('Invalid iOS redemption URL.');
    return response({ status: 'issued', redemption_url: redemptionUrl });
  }

  const issuedToken = await issueAndroidToken(env, migration);
  const newPackage = env.NEW_ANDROID_PACKAGE_NAME ?? 'com.moalab.whitegoatnotification';
  const referrer = encodeURIComponent(`migration_token=${issuedToken.token}`);
  return response({
    status: 'issued',
    migration_token: issuedToken.token,
    target_install_url: `https://play.google.com/store/apps/details?id=${encodeURIComponent(newPackage)}&referrer=${referrer}`,
    expires_at: issuedToken.expiresAt,
  });
}

async function handleRedeem(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request);
  const token = body.migration_token;
  if (!isMigrationToken(token)) throw new ApiError('invalid_request', 400);
  const tokenHash = await sha256Base64Url(token);
  const migration = await env.MIGRATION_DB.prepare(
    `SELECT * FROM migration_requests
     WHERE migration_token_hash = ? AND target_platform = 'android'
     LIMIT 1`,
  ).bind(tokenHash).first<MigrationRow>();
  if (!migration) throw new ApiError('token_expired', 410);
  if (!migration.token_expires_at || Date.parse(migration.token_expires_at) <= Date.now()) {
    throw new ApiError('token_expired', 410);
  }
  const code = await findCodeForMigration(env, migration.id);
  if (!code || isCodeExpired(code)) throw new ApiError('token_expired', 410);
  const promoCode = await decryptValue(code.value_ciphertext, code.value_iv, env.PROMO_CODE_ENCRYPTION_KEY);
  if (!/^[A-Za-z0-9_-]{4,256}$/.test(promoCode)) throw new Error('Invalid Android promo code.');
  return response({ redemption_url: `https://play.google.com/redeem?code=${encodeURIComponent(promoCode)}` });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === `${apiPrefix}issue`) {
        if (request.method !== 'POST') return response({ error: 'invalid_request' }, 405);
        return await handleIssue(request, env);
      }
      if (url.pathname === `${apiPrefix}redeem`) {
        if (request.method !== 'POST') return response({ error: 'invalid_request' }, 405);
        return await handleRedeem(request, env);
      }
      return env.ASSETS.fetch(request);
    } catch (error) {
      return errorResponse(error);
    }
  },
} satisfies ExportedHandler<Env>;
