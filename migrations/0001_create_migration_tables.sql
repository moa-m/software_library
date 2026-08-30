CREATE TABLE IF NOT EXISTS promo_codes (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('android', 'ios')),
  product_id TEXT NOT NULL CHECK (product_id = 'full_unlock'),
  value_ciphertext TEXT NOT NULL,
  value_iv TEXT NOT NULL,
  value_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'assigned')),
  migration_id TEXT UNIQUE,
  created_at TEXT NOT NULL,
  assigned_at TEXT
);

CREATE INDEX IF NOT EXISTS promo_codes_available_idx
  ON promo_codes(platform, product_id, status, expires_at);

CREATE TABLE IF NOT EXISTS migration_requests (
  id TEXT PRIMARY KEY,
  request_id_hash TEXT NOT NULL UNIQUE,
  target_platform TEXT NOT NULL CHECK (target_platform IN ('android', 'ios')),
  state TEXT NOT NULL CHECK (state IN ('pending', 'recall_pending', 'issued')),
  code_id TEXT UNIQUE,
  migration_token_hash TEXT UNIQUE,
  token_expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (code_id) REFERENCES promo_codes(id)
);

CREATE INDEX IF NOT EXISTS migration_requests_token_idx
  ON migration_requests(migration_token_hash, token_expires_at);
