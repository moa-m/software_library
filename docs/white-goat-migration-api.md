# 白ヤギ通知・無料移行API

## 初期設定

1. Cloudflare DashboardまたはWranglerでD1データベース`white-goat-migration`を作成する。
2. `wrangler.jsonc`の`database_id`を作成したD1のIDへ置き換える。
3. `npm install`後に、`npm run d1:migrate`でスキーマを適用する。
4. 次のWorkers Secretを登録する。値をソースコード、`.dev.vars`、ログへ保存しない。

```text
GOOGLE_SERVICE_ACCOUNT_JSON
PROMO_CODE_ENCRYPTION_KEY
```

5. 次の通常環境変数を設定する。

```text
LEGACY_CERTIFICATE_SHA256=<Play App Signing certificate SHA-256>
LEGACY_MIN_VERSION_CODE=<移行対応版のversionCode>
LEGACY_PACKAGE_NAME=moa.more.wiser.instant_notification
NEW_ANDROID_PACKAGE_NAME=com.moalab.whitegoatnotification
```

6. Play Consoleで旧アプリへGoogle Cloudプロジェクトをリンクし、Play IntegrityとDevice Recallを有効化する。Device Recallの利用承認前に本番公開してはいけない。

## コード在庫

Android CSVは`code,expires_at`、iOS CSVは`redemption_url,expires_at`をヘッダーにする。

```bash
PROMO_CODE_ENCRYPTION_KEY='<base64url-32-byte-key>' \
  npm run codes:import -- --platform android --file /secure/path/android-codes.csv

PROMO_CODE_LOW_STOCK_THRESHOLD=25 npm run codes:inventory
```

コードと引き換えURLはCLI出力、D1の平文、Workerログに出してはいけない。

## 配備前確認

```bash
npm run check
npm test
npm run d1:migrate
npm run deploy
```

本番配備後は、旧アプリをUnpublishedにして新規取得を停止してから、移行対応版を段階公開する。
