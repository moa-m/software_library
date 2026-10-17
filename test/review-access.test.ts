import { describe, expect, it, vi } from 'vitest';
import { sha256Base64Url } from '../src/crypto';
import type { Env } from '../src/types';
import worker from '../src/index';

const endpoint = 'https://example.com/white_goat/migration/v1/review/access';
const reviewCode = 'review_test_code_0123456789ABCDEF';
const promoCode = 'PROMO_TEST_0123456789';

interface PromoRow {
  value_hash: string;
  platform: string;
  product_id: string;
  expires_at: string;
  status: string;
}

function database(rows: PromoRow[] = []) {
  const first = vi.fn(async (hash: unknown, product: unknown) => {
    return rows.find((row) => row.value_hash === hash && row.platform === 'android'
      && row.product_id === product && row.status === 'assigned') ?? null;
  });
  const prepare = vi.fn((sql: string) => {
    // 入力コードのハッシュと対象商品・OS・割当状態をすべて絞る読み取りだけを許可する。
    expect(sql).toMatch(/^SELECT expires_at FROM promo_codes/);
    expect(sql).toContain("value_hash = ? AND platform = 'android' AND product_id = ? AND status = 'assigned'");
    return { bind: (...values: unknown[]) => ({ first: () => first(...values as [unknown, unknown]) }) };
  });
  return { prepare, first };
}

function request(code: unknown): Request {
  return new Request(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ access_code: code }),
  });
}

function env(db: ReturnType<typeof database>, hash?: string): Env {
  return { REVIEW_ACCESS_CODE_SHA256: hash, MIGRATION_DB: db as unknown as D1Database } as Env;
}

async function registeredPromo(overrides: Partial<PromoRow> = {}): Promise<PromoRow> {
  return {
    value_hash: await sha256Base64Url(promoCode),
    platform: 'android',
    product_id: 'full_unlock',
    expires_at: '2099-01-01T00:00:00.000Z',
    status: 'assigned',
    ...overrides,
  };
}

async function expectRejectedPromo(row: PromoRow) {
  const response = await worker.fetch(
    request(promoCode), env(database([row]), await sha256Base64Url(reviewCode)),
  );
  expect(response.status).toBe(403);
  expect(response.headers.get('cache-control')).toBe('no-store');
  await expect(response.json()).resolves.toEqual({ error: 'invalid_code' });
}

describe('shared promo and review access', () => {
  it('accepts the review code repeatedly without querying or consuming promo inventory', async () => {
    const db = database([await registeredPromo()]);
    const environment = env(db, await sha256Base64Url(reviewCode));

    const first = await worker.fetch(request(reviewCode), environment);
    const second = await worker.fetch(request(reviewCode), environment);

    expect(first.status).toBe(204);
    expect(second.status).toBe(204);
    expect(await first.text()).toBe('');
    expect(first.headers.get('cache-control')).toBe('no-store');
    expect(db.prepare).not.toHaveBeenCalled();
  });

  it('returns the assigned Android promo URL repeatedly without granting access or changing inventory', async () => {
    const row = await registeredPromo();
    const before = { ...row };
    const db = database([row]);
    const environment = env(db, await sha256Base64Url(reviewCode));

    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await worker.fetch(request(promoCode), environment);
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe('no-store');
      await expect(response.json()).resolves.toEqual({
        redemption_url: `https://play.google.com/redeem?code=${promoCode}`,
      });
    }
    expect(row).toEqual(before);
    expect(db.first).toHaveBeenCalledWith(await sha256Base64Url(promoCode), 'full_unlock');
  });

  it('rejects an incorrect code', async () => {
    const response = await worker.fetch(
      request('review_test_code_0123456789ABCDE0'),
      env(database(), await sha256Base64Url(reviewCode)),
    );
    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: 'invalid_code' });
  });

  it.each(['2020-01-01T00:00:00.000Z', 'not-a-date'])(
    'rejects expired or invalid expiry dates: %s', async (expires_at) => {
      await expectRejectedPromo(await registeredPromo({ expires_at }));
    },
  );

  it('rejects unassigned inventory codes', async () => {
    await expectRejectedPromo(await registeredPromo({ status: 'available' }));
  });

  it('rejects codes for another platform', async () => {
    await expectRejectedPromo(await registeredPromo({ platform: 'ios' }));
  });

  it('rejects codes for another product', async () => {
    await expectRejectedPromo(await registeredPromo({ product_id: 'other_product' }));
  });

  it.each([undefined, 'malformed-secret'])(
    'allows an assigned promo without a usable review secret: %s', async (hash) => {
      const response = await worker.fetch(request(promoCode), env(database([await registeredPromo()]), hash));
      expect(response.status).toBe(200);
    },
  );

  it('does not grant unknown codes without a configured review secret', async () => {
    const response = await worker.fetch(request(reviewCode), env(database()));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'temporarily_unavailable' });
  });

  it('does not grant access on a database failure', async () => {
    const db = database();
    db.first.mockRejectedValueOnce(new Error('database unavailable'));
    const response = await worker.fetch(request(promoCode), env(db, await sha256Base64Url(reviewCode)));
    expect(response.status).toBe(503);
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({ error: 'temporarily_unavailable' });
  });

  it.each(['ABCD', 'A'.repeat(256)])('accepts supported code-length boundaries', async (code) => {
    const row = await registeredPromo({ value_hash: await sha256Base64Url(code) });
    const response = await worker.fetch(request(code), env(database([row])));
    expect(response.status).toBe(200);
  });

  it.each(['abc', 'A'.repeat(257), 'INVALID CODE', 'コード', '', 123, null])(
    'rejects invalid input without querying inventory: %s', async (code) => {
      const db = database();
      const response = await worker.fetch(request(code), env(db, await sha256Base64Url(reviewCode)));
      expect(response.status).toBe(403);
      expect(db.prepare).not.toHaveBeenCalled();
    },
  );
});
