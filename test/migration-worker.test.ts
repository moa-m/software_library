import { beforeEach, describe, expect, it, vi } from 'vitest';
import { encryptValue, sha256Base64Url } from '../src/crypto';
import { requestHashFor } from '../src/validation';
import type { Env, IntegrityVerdict, MigrationRow, PromoCodeRow } from '../src/types';

const googleMocks = vi.hoisted(() => ({
  decodeIntegrityToken: vi.fn(),
  markDeviceMigrationIssued: vi.fn(),
}));

vi.mock('../src/google-play', () => googleMocks);

import worker from '../src/index';

class FakeMigrationDatabase {
  readonly migrations: MigrationRow[] = [];
  readonly codes: PromoCodeRow[] = [{
    id: 'code-1',
    platform: 'android',
    value_ciphertext: 'unused-in-issue-test',
    value_iv: 'unused-in-issue-test',
    expires_at: '2099-01-01T00:00:00.000Z',
    status: 'available',
    migration_id: null,
  }];

  prepare(sql: string): D1PreparedStatement {
    return {
      bind: (...values: unknown[]) => ({
        first: async <T>() => this.first(sql, values) as T | null,
        run: async () => {
          this.run(sql, values);
          return { success: true } as D1Result;
        },
      }),
    } as unknown as D1PreparedStatement;
  }

  private first(sql: string, values: unknown[]): MigrationRow | PromoCodeRow | null {
    if (sql.includes('FROM migration_requests WHERE request_id_hash')) {
      return this.migrations.find((row) => row.request_id_hash === values[0]) ?? null;
    }
    if (sql.includes('WHERE migration_token_hash =')) {
      return this.migrations.find((row) => row.migration_token_hash === values[0]) ?? null;
    }
    if (sql.includes('FROM promo_codes WHERE migration_id')) {
      return this.codes.find((row) => row.migration_id === values[0]) ?? null;
    }
    if (sql.includes("UPDATE promo_codes\n       SET status = 'assigned'")) {
      const code = this.codes.find((row) => row.status === 'available') ?? null;
      if (code) {
        code.status = 'assigned';
        code.migration_id = values[0] as string;
      }
      return code;
    }
    throw new Error(`Unexpected first query: ${sql}`);
  }

  private run(sql: string, values: unknown[]): void {
    if (sql.includes('INSERT OR IGNORE INTO migration_requests')) {
      const requestIdHash = values[1] as string;
      if (this.migrations.some((row) => row.request_id_hash === requestIdHash)) return;
      this.migrations.push({
        id: values[0] as string,
        request_id_hash: requestIdHash,
        target_platform: 'android',
        state: 'pending',
        code_id: null,
        migration_token_hash: null,
        token_expires_at: null,
        created_at: values[3] as string,
        updated_at: values[4] as string,
      });
      return;
    }
    const migrationId = values.at(-1) as string;
    const migration = this.migrations.find((row) => row.id === migrationId);
    if (!migration) throw new Error('Migration row was not found.');
    if (sql.includes('SET code_id =')) {
      migration.code_id = values[0] as string;
      migration.state = 'recall_pending';
    } else if (sql.includes("SET state = 'issued'")) {
      migration.state = 'issued';
    } else if (sql.includes('SET migration_token_hash =')) {
      migration.migration_token_hash = values[0] as string;
      migration.token_expires_at = values[1] as string;
    } else {
      throw new Error(`Unexpected run query: ${sql}`);
    }
  }
}

function env(database: FakeMigrationDatabase): Env {
  return {
    MIGRATION_DB: database as unknown as D1Database,
    ASSETS: {} as Fetcher,
    GOOGLE_SERVICE_ACCOUNT_JSON: '{}',
    PROMO_CODE_ENCRYPTION_KEY: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    LEGACY_CERTIFICATE_SHA256: 'certificate',
    LEGACY_MIN_VERSION_CODE: '32',
    LEGACY_PACKAGE_NAME: 'moa.more.wiser.instant_notification',
    NEW_ANDROID_PACKAGE_NAME: 'com.moalab.whitegoatnotification',
  };
}

function issueRequest(requestId: string, platform = 'android'): Request {
  return new Request('https://example.com/white_goat/migration/v1/migration/issue', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      integrity_token: 'integrity-token-value',
      request_id: requestId,
      target_platform: platform,
    }),
  });
}

function redeemRequest(token: string): Request {
  return new Request('https://example.com/white_goat/migration/v1/migration/redeem', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ migration_token: token }),
  });
}

async function integrityVerdict(requestId: string, recalled = false): Promise<IntegrityVerdict> {
  return {
    requestPackageName: 'moa.more.wiser.instant_notification',
    requestHash: await requestHashFor(requestId, 'android'),
    timestampMillis: Date.now(),
    appRecognitionVerdict: 'PLAY_RECOGNIZED',
    packageName: 'moa.more.wiser.instant_notification',
    certificateSha256Digest: ['certificate'],
    versionCode: 32,
    appLicensingVerdict: 'LICENSED',
    deviceRecognitionVerdicts: ['MEETS_DEVICE_INTEGRITY'],
    deviceRecallBitFirst: recalled,
  };
}

describe('migration issue worker', () => {
  const requestId = 'A'.repeat(22);

  beforeEach(async () => {
    googleMocks.decodeIntegrityToken.mockReset();
    googleMocks.markDeviceMigrationIssued.mockReset();
    googleMocks.decodeIntegrityToken.mockResolvedValue(await integrityVerdict(requestId));
    googleMocks.markDeviceMigrationIssued.mockResolvedValue(undefined);
  });

  it('rejects iOS as an unsupported target', async () => {
    const response = await worker.fetch(issueRequest(requestId, 'ios'), env(new FakeMigrationDatabase()));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'invalid_request' });
    expect(googleMocks.decodeIntegrityToken).not.toHaveBeenCalled();
  });

  it('reissues only the short-lived token for the same request ID', async () => {
    const database = new FakeMigrationDatabase();
    const environment = env(database);

    const first = await worker.fetch(issueRequest(requestId), environment);
    const second = await worker.fetch(issueRequest(requestId), environment);
    const firstBody = await first.json() as Record<string, string>;
    const secondBody = await second.json() as Record<string, string>;

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(firstBody.status).toBe('issued');
    expect(firstBody.migration_token).not.toBe(secondBody.migration_token);
    expect(firstBody.expires_at).toBeTruthy();
    expect(database.migrations).toHaveLength(1);
    expect(database.codes.filter((code) => code.status === 'assigned')).toHaveLength(1);
    expect(googleMocks.markDeviceMigrationIssued).toHaveBeenCalledTimes(1);
  });

  it('rejects a different request ID from a recalled device', async () => {
    const otherRequestId = 'B'.repeat(22);
    googleMocks.decodeIntegrityToken.mockResolvedValue(await integrityVerdict(otherRequestId, true));

    const response = await worker.fetch(
      issueRequest(otherRequestId),
      env(new FakeMigrationDatabase()),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'ineligible' });
  });

  it('returns inventory_exhausted without an available Android code', async () => {
    const database = new FakeMigrationDatabase();
    database.codes.length = 0;

    const response = await worker.fetch(issueRequest(requestId), env(database));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: 'inventory_exhausted' });
  });
});

describe('migration redeem worker', () => {
  const encryptionKey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
  const token = 'R'.repeat(32);

  async function redeemableDatabase(expiresAt = '2099-01-01T00:00:00.000Z') {
    const database = new FakeMigrationDatabase();
    const encrypted = await encryptValue('PROMO_CODE_1', encryptionKey);
    database.migrations.push({
      id: 'migration-1',
      request_id_hash: 'request-hash',
      target_platform: 'android',
      state: 'issued',
      code_id: 'code-1',
      migration_token_hash: await sha256Base64Url(token),
      token_expires_at: expiresAt,
      created_at: '2026-09-22T00:00:00.000Z',
      updated_at: '2026-09-22T00:00:00.000Z',
    });
    Object.assign(database.codes[0], {
      value_ciphertext: encrypted.ciphertext,
      value_iv: encrypted.iv,
      status: 'assigned',
      migration_id: 'migration-1',
    });
    return database;
  }

  it('returns the same Google Play URL when a valid token is retried', async () => {
    const database = await redeemableDatabase();
    const environment = env(database);

    const first = await worker.fetch(redeemRequest(token), environment);
    const second = await worker.fetch(redeemRequest(token), environment);

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(await first.json()).toEqual(await second.json());
  });

  it('rejects malformed and expired tokens', async () => {
    const invalid = await worker.fetch(redeemRequest('short'), env(await redeemableDatabase()));
    const expired = await worker.fetch(
      redeemRequest(token),
      env(await redeemableDatabase('2020-01-01T00:00:00.000Z')),
    );

    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toEqual({ error: 'invalid_request' });
    expect(expired.status).toBe(410);
    await expect(expired.json()).resolves.toEqual({ error: 'token_expired' });
  });
});
