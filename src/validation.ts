import { sha256Base64Url } from './crypto';
import type { Env, IntegrityVerdict, Platform } from './types';

const maxIntegrityAgeMillis = 2 * 60 * 1000;

export function isPlatform(value: unknown): value is Platform {
  return value === 'android' || value === 'ios';
}

export function isRequestId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{22,128}$/.test(value);
}

export function isMigrationToken(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{16,512}$/.test(value);
}

export async function requestHashFor(requestId: string, platform: Platform): Promise<string> {
  return sha256Base64Url(`v1/migration/issue\n${requestId}\n${platform}`);
}

export function assertEligibleVerdict(
  verdict: IntegrityVerdict,
  env: Env,
  expectedRequestHash: string,
  allowPreviouslyIssuedDevice = false,
): void {
  const expectedPackage = env.LEGACY_PACKAGE_NAME ?? 'moa.more.wiser.instant_notification';
  const expectedCertificate = env.LEGACY_CERTIFICATE_SHA256;
  const minimumVersion = Number(env.LEGACY_MIN_VERSION_CODE);
  const now = Date.now();
  if (
    verdict.requestPackageName !== expectedPackage ||
    verdict.requestHash !== expectedRequestHash ||
    !Number.isFinite(verdict.timestampMillis) ||
    Math.abs(now - verdict.timestampMillis) > maxIntegrityAgeMillis ||
    verdict.appRecognitionVerdict !== 'PLAY_RECOGNIZED' ||
    verdict.packageName !== expectedPackage ||
    !verdict.certificateSha256Digest.includes(expectedCertificate) ||
    !Number.isFinite(verdict.versionCode) || verdict.versionCode < minimumVersion ||
    verdict.appLicensingVerdict !== 'LICENSED' ||
    !verdict.deviceRecognitionVerdicts.includes('MEETS_DEVICE_INTEGRITY') ||
    (!allowPreviouslyIssuedDevice && verdict.deviceRecallBitFirst)
  ) {
    throw new Error('INELIGIBLE');
  }
}
