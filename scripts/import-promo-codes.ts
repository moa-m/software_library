import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { randomUUID, webcrypto } from 'node:crypto';

const encoder = new TextEncoder();

type Platform = 'android' | 'ios';

function base64Url(value: Uint8Array): string {
  return Buffer.from(value).toString('base64url');
}

function decodeKey(value: string): Uint8Array {
  const key = Buffer.from(value, 'base64url');
  if (key.byteLength !== 32) throw new Error('PROMO_CODE_ENCRYPTION_KEY must be a 32-byte base64url value.');
  return key;
}

async function encrypt(value: string, keyText: string): Promise<{ ciphertext: string; iv: string }> {
  const iv = new Uint8Array(12);
  webcrypto.getRandomValues(iv);
  const key = await webcrypto.subtle.importKey('raw', decodeKey(keyText), 'AES-GCM', false, ['encrypt']);
  const ciphertext = await webcrypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(value));
  return { ciphertext: base64Url(new Uint8Array(ciphertext)), iv: base64Url(iv) };
}

function requiredOption(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith('--')) throw new Error(`${name} is required.`);
  return value;
}

function parseCsv(raw: string): Array<Record<string, string>> {
  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) throw new Error('CSV must include a header and at least one code.');
  const headers = lines[0].split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function runWrangler(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'npx',
      ['wrangler', 'd1', 'execute', 'white-goat-migration', '--remote', '--command', sql],
      { stdio: ['ignore', 'inherit', 'inherit'], shell: process.platform === 'win32' },
    );
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error('D1 import failed.')));
  });
}

async function main(): Promise<void> {
  const platform = requiredOption('--platform') as Platform;
  if (platform !== 'android' && platform !== 'ios') throw new Error('--platform must be android or ios.');
  const file = requiredOption('--file');
  const key = process.env.PROMO_CODE_ENCRYPTION_KEY;
  if (!key) throw new Error('PROMO_CODE_ENCRYPTION_KEY is required.');
  const rows = parseCsv(await readFile(file, 'utf8'));
  let imported = 0;
  for (const row of rows) {
    const value = platform === 'android' ? row.code : row.redemption_url;
    const expiresAt = row.expires_at;
    if (!value || !expiresAt || Number.isNaN(Date.parse(expiresAt))) throw new Error('Each row needs a valid value and expires_at.');
    if (platform === 'android' && !/^[A-Za-z0-9_-]{4,256}$/.test(value)) throw new Error('Android code format is invalid.');
    if (platform === 'ios') {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'apps.apple.com') throw new Error('iOS redemption_url must be an apps.apple.com HTTPS URL.');
    }
    const encrypted = await encrypt(value, key);
    const hash = base64Url(new Uint8Array(await webcrypto.subtle.digest('SHA-256', encoder.encode(value))));
    const sql = `INSERT INTO promo_codes (id, platform, product_id, value_ciphertext, value_iv, value_hash, expires_at, created_at) VALUES ('${randomUUID()}', '${platform}', 'full_unlock', '${encrypted.ciphertext}', '${encrypted.iv}', '${hash}', '${expiresAt.replaceAll("'", "''")}', '${new Date().toISOString()}');`;
    await runWrangler(sql);
    imported += 1;
  }
  process.stdout.write(`Imported ${imported} ${platform} code(s).\n`);
}

void main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Import failed.'}\n`);
  process.exitCode = 1;
});
