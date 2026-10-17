import { describe, expect, it, vi } from 'vitest';
import type { Env } from '../src/types';
import worker from '../src/index';

const endpoint = 'https://example.com/white_goat/migration/v1/campaign/entitlement';

describe('retired entitlement endpoint', () => {
  it.each(['POST', 'DELETE', 'GET'])('rejects %s without accessing grants or serving HTML', async (method) => {
    const prepare = vi.fn(() => { throw new Error('database must not be accessed'); });
    const fetchAsset = vi.fn(async () => new Response('<html>not an API response</html>'));
    const environment = {
      MIGRATION_DB: { prepare },
      ASSETS: { fetch: fetchAsset },
    } as unknown as Env;
    const request = new Request(endpoint, {
      method,
      ...(method === 'GET' ? {} : {
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id_token: 'obsolete-claim', integrity_token: 'obsolete-proof' }),
      }),
    });

    const response = await worker.fetch(request, environment);

    expect(response.status).toBe(410);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(response.headers.get('cache-control')).toBe('no-store');
    await expect(response.json()).resolves.toEqual({ error: 'endpoint_retired' });
    expect(prepare).not.toHaveBeenCalled();
    expect(fetchAsset).not.toHaveBeenCalled();
  });
});
