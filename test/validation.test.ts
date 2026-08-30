import { describe, expect, it } from 'vitest';
import { assertEligibleVerdict, isMigrationToken, isRequestId } from '../src/validation';
import type { Env, IntegrityVerdict } from '../src/types';

const env = {
  LEGACY_CERTIFICATE_SHA256: 'certificate',
  LEGACY_MIN_VERSION_CODE: '32',
  LEGACY_PACKAGE_NAME: 'moa.more.wiser.instant_notification',
} as Env;

function validVerdict(): IntegrityVerdict {
  return {
    requestPackageName: 'moa.more.wiser.instant_notification',
    requestHash: 'hash',
    timestampMillis: Date.now(),
    appRecognitionVerdict: 'PLAY_RECOGNIZED',
    packageName: 'moa.more.wiser.instant_notification',
    certificateSha256Digest: ['certificate'],
    versionCode: 32,
    appLicensingVerdict: 'LICENSED',
    deviceRecognitionVerdicts: ['MEETS_DEVICE_INTEGRITY'],
    deviceRecallBitFirst: false,
  };
}

describe('migration validation', () => {
  it('accepts the expected integrity verdict', () => {
    expect(() => assertEligibleVerdict(validVerdict(), env, 'hash')).not.toThrow();
  });

  it('rejects a previously issued device', () => {
    const verdict = validVerdict();
    verdict.deviceRecallBitFirst = true;
    expect(() => assertEligibleVerdict(verdict, env, 'hash')).toThrow('INELIGIBLE');
    expect(() => assertEligibleVerdict(verdict, env, 'hash', true)).not.toThrow();
  });

  it('validates opaque IDs without accepting user-entered values', () => {
    expect(isRequestId('A'.repeat(22))).toBe(true);
    expect(isRequestId('short')).toBe(false);
    expect(isMigrationToken('B'.repeat(16))).toBe(true);
    expect(isMigrationToken('token with space')).toBe(false);
  });
});
