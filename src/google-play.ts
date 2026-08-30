import { base64UrlDecode, base64UrlEncode, toArrayBuffer } from './crypto';
import type { Env, IntegrityVerdict } from './types';

const oauthScope = 'https://www.googleapis.com/auth/playintegrity';
const oauthEndpoint = 'https://oauth2.googleapis.com/token';
const playIntegrityBaseUrl = 'https://playintegrity.googleapis.com/v1';

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

interface CachedToken {
  value: string;
  expiresAt: number;
}

let cachedAccessToken: CachedToken | undefined;

function pemToBytes(pem: string): Uint8Array {
  const normalized = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s/g, '');
  return base64UrlDecode(normalized.replaceAll('+', '-').replaceAll('/', '_'));
}

async function getAccessToken(serviceAccountJson: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60) {
    return cachedAccessToken.value;
  }

  const account = JSON.parse(serviceAccountJson) as ServiceAccount;
  if (!account.client_email || !account.private_key) throw new Error('Google service account is invalid.');

  const header = base64UrlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const claims = base64UrlEncode(new TextEncoder().encode(JSON.stringify({
    iss: account.client_email,
    scope: oauthScope,
    aud: account.token_uri ?? oauthEndpoint,
    iat: now,
    exp: now + 3600,
  })));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    toArrayBuffer(pemToBytes(account.private_key)),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signed = `${header}.${claims}`;
  const signature = await crypto.subtle.sign(
    { name: 'RSASSA-PKCS1-v1_5' },
    key,
    new TextEncoder().encode(signed),
  );
  const assertion = `${signed}.${base64UrlEncode(new Uint8Array(signature))}`;
  const response = await fetch(account.token_uri ?? oauthEndpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) throw new Error('Unable to obtain Google access token.');
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token || !payload.expires_in) throw new Error('Google access token response is invalid.');
  cachedAccessToken = { value: payload.access_token, expiresAt: now + payload.expires_in };
  return payload.access_token;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export async function decodeIntegrityToken(env: Env, token: string): Promise<IntegrityVerdict> {
  const packageName = env.LEGACY_PACKAGE_NAME ?? 'moa.more.wiser.instant_notification';
  const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const response = await fetch(`${playIntegrityBaseUrl}/${encodeURIComponent(packageName)}:decodeIntegrityToken`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ integrity_token: token }),
  });
  if (!response.ok) throw new Error('Google Play Integrity verification failed.');
  const payload = await response.json() as Record<string, unknown>;
  const external = payload.tokenPayloadExternal as Record<string, unknown> | undefined;
  if (!external) throw new Error('Google Play Integrity response is invalid.');
  const requestDetails = external.requestDetails as Record<string, unknown> | undefined;
  const appIntegrity = external.appIntegrity as Record<string, unknown> | undefined;
  const accountDetails = external.accountDetails as Record<string, unknown> | undefined;
  const deviceIntegrity = external.deviceIntegrity as Record<string, unknown> | undefined;
  const deviceRecall = deviceIntegrity?.deviceRecall as Record<string, unknown> | undefined;
  const recallValues = deviceRecall?.values as Record<string, unknown> | undefined;
  if (!requestDetails || !appIntegrity || !accountDetails || !deviceIntegrity) {
    throw new Error('Google Play Integrity verdict is incomplete.');
  }
  return {
    requestPackageName: String(requestDetails.requestPackageName ?? ''),
    requestHash: String(requestDetails.requestHash ?? ''),
    timestampMillis: Number(requestDetails.timestampMillis ?? 0),
    appRecognitionVerdict: String(appIntegrity.appRecognitionVerdict ?? ''),
    packageName: typeof appIntegrity.packageName === 'string' ? appIntegrity.packageName : null,
    certificateSha256Digest: stringArray(appIntegrity.certificateSha256Digest),
    versionCode: Number(appIntegrity.versionCode ?? 0),
    appLicensingVerdict: String(accountDetails.appLicensingVerdict ?? ''),
    deviceRecognitionVerdicts: stringArray(deviceIntegrity.deviceRecognitionVerdict),
    deviceRecallBitFirst: recallValues?.bitFirst === true,
  };
}

export async function markDeviceMigrationIssued(env: Env, integrityToken: string): Promise<void> {
  const packageName = env.LEGACY_PACKAGE_NAME ?? 'moa.more.wiser.instant_notification';
  const accessToken = await getAccessToken(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const response = await fetch(`${playIntegrityBaseUrl}/${encodeURIComponent(packageName)}/deviceRecall:write`, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ integrityToken, newValues: { bitFirst: true } }),
  });
  if (!response.ok) throw new Error('Unable to update Device Recall.');
}
