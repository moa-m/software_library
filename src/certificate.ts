import { base64UrlEncode } from './crypto';

/** Play Console の16進SHA-256指紋とIntegrity APIのBase64URL値を照合する。 */
export function matchesCertificateDigest(verdictDigests: string[], configured: string | undefined): boolean {
  if (!configured) return false;
  return configured.split(',').some((entry) => {
    const fingerprint = entry.trim();
    const hex = fingerprint.replaceAll(':', '');
    if (/^[0-9a-fA-F]{64}$/.test(hex)) {
      const bytes = Uint8Array.from(hex.match(/.{2}/g)!, (part) => Number.parseInt(part, 16));
      return verdictDigests.includes(base64UrlEncode(bytes));
    }
    return /^[A-Za-z0-9_-]{43}$/.test(fingerprint) && verdictDigests.includes(fingerprint);
  });
}
