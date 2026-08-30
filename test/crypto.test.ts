import { describe, expect, it } from 'vitest';
import { decryptValue, encryptValue, randomToken, sha256Base64Url } from '../src/crypto';
import { requestHashFor } from '../src/validation';

describe('migration crypto', () => {
  const key = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';

  it('encrypts values without retaining plaintext', async () => {
    const encrypted = await encryptValue('private-promo-code', key);
    expect(encrypted.ciphertext).not.toContain('private-promo-code');
    await expect(decryptValue(encrypted.ciphertext, encrypted.iv, key)).resolves.toBe('private-promo-code');
  });

  it('creates URL-safe random migration tokens', () => {
    expect(randomToken()).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it('binds a request hash to its platform and request ID', async () => {
    const requestId = 'A'.repeat(22);
    await expect(requestHashFor(requestId, 'android')).resolves.toBe(
      await sha256Base64Url(`v1/migration/issue\n${requestId}\nandroid`),
    );
    await expect(requestHashFor(requestId, 'ios')).not.resolves.toBe(
      await requestHashFor(requestId, 'android'),
    );
  });
});
