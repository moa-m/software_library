export interface Env {
  ASSETS: Fetcher;
  MIGRATION_DB: D1Database;
  GOOGLE_SERVICE_ACCOUNT_JSON: string;
  PROMO_CODE_ENCRYPTION_KEY: string;
  LEGACY_CERTIFICATE_SHA256: string;
  LEGACY_MIN_VERSION_CODE: string;
  LEGACY_PACKAGE_NAME?: string;
  NEW_ANDROID_PACKAGE_NAME?: string;
}

export type Platform = 'android' | 'ios';

export interface PromoCodeRow {
  id: string;
  platform: Platform;
  value_ciphertext: string;
  value_iv: string;
  expires_at: string;
  status: 'available' | 'assigned';
  migration_id: string | null;
}

export interface MigrationRow {
  id: string;
  request_id_hash: string;
  target_platform: Platform;
  state: 'pending' | 'recall_pending' | 'issued';
  code_id: string | null;
  migration_token_hash: string | null;
  token_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrityVerdict {
  requestPackageName: string;
  requestHash: string;
  timestampMillis: number;
  appRecognitionVerdict: string;
  packageName: string | null;
  certificateSha256Digest: string[];
  versionCode: number;
  appLicensingVerdict: string;
  deviceRecognitionVerdicts: string[];
  deviceRecallBitFirst: boolean;
}
