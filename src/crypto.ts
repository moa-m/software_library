const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function toArrayBuffer(value: Uint8Array): ArrayBuffer {
  return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength) as ArrayBuffer;
}

export function base64UrlEncode(value: Uint8Array): string {
  let binary = '';
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return base64UrlEncode(new Uint8Array(digest));
}

export function randomToken(bytes = 32): string {
  const value = new Uint8Array(bytes);
  crypto.getRandomValues(value);
  return base64UrlEncode(value);
}

async function encryptionKey(secret: string): Promise<CryptoKey> {
  const raw = base64UrlDecode(secret);
  if (raw.byteLength !== 32) throw new Error('PROMO_CODE_ENCRYPTION_KEY must be 32 bytes.');
  return crypto.subtle.importKey('raw', toArrayBuffer(raw), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptValue(value: string, secret: string): Promise<{ ciphertext: string; iv: string }> {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(iv) },
    await encryptionKey(secret),
    toArrayBuffer(encoder.encode(value)),
  );
  return { ciphertext: base64UrlEncode(new Uint8Array(encrypted)), iv: base64UrlEncode(iv) };
}

export async function decryptValue(ciphertext: string, iv: string, secret: string): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: toArrayBuffer(base64UrlDecode(iv)) },
    await encryptionKey(secret),
    toArrayBuffer(base64UrlDecode(ciphertext)),
  );
  return decoder.decode(decrypted);
}
