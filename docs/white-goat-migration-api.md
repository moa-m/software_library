# 白ヤギ通知・無料移行API

## 初期設定

1. Cloudflare DashboardまたはWranglerでD1データベース`white-goat-migration`を作成する。
2. `wrangler.jsonc`の`database_id`を作成したD1のIDへ置き換える。
3. `npm install`後に、`npm run d1:migrate`でスキーマを適用する。
4. 次のWorkers Secretを登録する。値をソースコード、`.dev.vars`、ログへ保存しない。

```text
GOOGLE_SERVICE_ACCOUNT_JSON
PROMO_CODE_ENCRYPTION_KEY
REVIEW_ACCESS_CODE_SHA256
```

5. 次の通常環境変数を設定する。

```text
LEGACY_CERTIFICATE_SHA256=<Play App Signing certificate SHA-256>
LEGACY_MIN_VERSION_CODE=<移行対応版のversionCode>
LEGACY_PACKAGE_NAME=moa.more.wiser.instant_notification
NEW_ANDROID_PACKAGE_NAME=com.moalab.whitegoatnotification
LEGACY_PROMO_ISSUANCE_ENABLED=true（旧アプリでのコード割り当てを継続する）
```

6. Play Consoleで旧アプリへGoogle Cloudプロジェクトをリンクし、Play Integrityを有効化する。Device Recallは使用しない。

## コード在庫

Android CSVは`code,expires_at`をヘッダーにする。Google Play ConsoleのエクスポートCSV（`Promotion code`列のみ）も対応しており、その場合は有効期限を引数で指定する。iOS用コードとApp Store引き換えURLは取り込まない。

```bash
PROMO_CODE_ENCRYPTION_KEY='<base64url-32-byte-key>' \
  npm run codes:import -- --platform android --file /secure/path/android-codes.csv

# Google PlayのCSVから初回450件だけを登録する例（日本時間2026年11月30日23:00まで）
PROMO_CODE_ENCRYPTION_KEY='<base64url-32-byte-key>' \
  npm run codes:import -- --platform android --file /secure/path/promotion_codes.csv \
  --expires-at 2026-11-30T14:00:00.000Z --limit 450

PROMO_CODE_LOW_STOCK_THRESHOLD=25 npm run codes:inventory
```

コードと引き換えURLはCLI出力、D1の平文、Workerログに出してはいけない。

Play Consoleで期限を延長した場合は、D1の対象コードの`expires_at`も同期する。未割当の`available`と割当済みの`assigned`の両方を対象にし、コード本体や割当関係は保持する。同じCSVの再取込は既存コードの期限更新には使わない。

2026-10-26: 独立レビュー後、本番のAndroid/full_unlockで旧期限`2026-10-31T14:00:00.000Z`に一致する450件の期限だけを`2026-11-30T14:00:00.000Z`（11月30日23:00、日本時間）へ延長。更新後はavailable 450件・assigned 0件、旧期限0件、総在庫450件。Worker再配備・スキーマ変更はなし。

## 配備前確認

```bash
npm run check
npm test
npm run d1:migrate
npm run deploy -- --keep-vars
```

配備時は`--keep-vars`で既存の通常環境変数を保持する。旧アプリの署名・最低版、Play Integrity、コード暗号化キー、D1接続、審査用Secretを確認してから配備する。

本番配備後は、旧アプリをUnpublishedにして新規取得を停止してから、移行対応版を段階公開する。

## API契約

### プロモーションコード・審査用コードの共通入力

新アプリの購入画面に共通の「コードを入力」入口を設け、`POST /v1/review/access`へJSONの`access_code`を送る。APIの完全なパスは`/white_goat/migration/v1/review/access`。入力は英数字・アンダースコア・ハイフンの4〜256文字とし、大文字小文字を区別する。コードやレスポンスの引き換えURLはログに出さない。すべてのレスポンスに`Cache-Control: no-store`を付ける。

| コード | 応答・アプリの処理 |
| --- | --- |
| 審査用Secretのハッシュと完全一致 | 本文なしの204。アプリは起動中だけ審査用アクセスを許可する。購入権利を作らず、コード在庫も読み書きしない。再起動後は再入力する。 |
| D1に割り当て済みの通常コード | 200と`redemption_url`。Google Playの引き換え画面を開く。このAPI成功だけでは解除しない。引き換え後にGoogle Play購入情報の`full_unlock`を確認して解除する。 |
| 未登録・未割り当て・期限切れ・別OS・別商品のコード | `403 {"error":"invalid_code"}`。解除しない。 |
| D1障害 | `503 {"error":"temporarily_unavailable"}`。解除しない。 |

通常コードは平文ではなくSHA-256のbase64url値でD1の`value_hash`を検索し、`platform=android`・`product_id=full_unlock`・`status=assigned`・有効期限内を確認する。`available`のコードは旧アプリで割り当てる前に利用できない。共通入力での照合は在庫を変更せず、Google Playでの使用済み状態も管理しない。実際の引き換え可否はGoogle Playが判定する。

審査用は通常の在庫から取り分けず、独立したランダムコードを使う。同じコードを複数回入力でき、プロモーションの期限や在庫数に影響されない。本番配備前に、十分長いランダムなコードを秘密管理ツールで作成し、SHA-256をbase64url（パディングなし）で表した43文字の値をWorkers Secret `REVIEW_ACCESS_CODE_SHA256` に登録する。コード本体はPlay Consoleの「アプリへのアクセス」にのみ記載し、リポジトリ、アプリ、Workers環境変数、CLI引数に保存しない。コード変更時はSecretとPlay Consoleの記載を同時に更新する。

審査用Secretが未設定・不正形式でも、割り当て済み通常コードは利用できる。この状態で通常コードに一致しない入力は503を返し、審査設定の未完了を誤コードとして扱わない。Secret設定済みの誤コードは403を返す。審査コードを正しく入力した場合はD1障害時も204を返せる。

この入口はGoogle Play版だけに表示する。通常の購入・復元処理は維持する。Playプロモーションコードの引き換えは期限内に1回だけできるが、引き換えた`full_unlock`は非消費型の購入情報として残る。同じGoogleアカウントであればAndroid端末の変更・再インストール後も追加料金なしで復元でき、コードの再入力は不要。メモ・履歴・設定の移行とは別である。

旧Androidアプリは起動時に`POST /v1/migration/issue`を呼び、コードを自動で割り当てる。移行案内の既読とは分離し、失敗時は次回起動で再試行する。同じ匿名`request_id`と進行中の処理を共有し、有効な`migration_token`は旧アプリ内で再利用する。

`POST /v1/migration/issue`の`target_platform`は`android`だけを受理する。同じ`request_id`では割り当て済みのGoogle Playプロモーションコードを再利用し、15分間有効な`migration_token`だけを更新する。レスポンスは`status`、`migration_token`、`target_install_url`、`expires_at`を返す。

無料移行は匿名の`request_id`単位で管理する。Device Recallや端末識別子は使用しないため、異なる`request_id`は別の申請として扱い、それぞれ在庫を1件消費できる。旧アプリのデータ消去などで`request_id`が失われた場合の重複発行は防止対象外とする。在庫数を監視し、異常な消費や不正利用が疑われる場合は`LEGACY_PROMO_ISSUANCE_ENABLED=false`で新規割り当てを停止する。

`POST /v1/migration/redeem`は有効な`migration_token`に対して、割り当て済みコードの同じ`play.google.com`引き換えURLを返す。1回限りなのはGoogle Playでのコードの引き換えであり、通信の試行回数ではない。引き換え後の`full_unlock`は同じGoogleアカウントで端末変更・再インストール後も復元できる。

既存D1の在庫・移行記録とスキーマは維持し、テーブルの削除は行わない。適用済みスキーマにある旧状態値`recall_pending`は互換性のため残すが、新規書き込みには使用せず、既存の割り当て済みコードを再利用した時点で`issued`へ更新する。

## Device Recall廃止版の配備記録

2026-10-27: ユーザー承認後、Device Recallの読み取り・書き込み・発行済み端末判定を除去したWorkerを本番反映した。最終バージョンは`e5e485d8-1136-4277-8260-c7265e7c13ab`、変更前は`43bfc906-31de-43b3-b0a5-089ce5c8d5ed`。取得した本番ソースが検証済み候補とSHA-256一致し、Device Recallへの参照がないことを確認。公開4ページの応答本文は配備前後でハッシュ一致。GET・不正入力・iOS・不正/未登録トークンの拒否と`no-store`を確認した。配備時にmacOSの`.DS_Store`が含まれたため、`public/.assetsignore`で除外して最終反映し、該当3パスの404を確認した。

D1のスキーマ・在庫・割り当ては変更していない。配備前後ともAndroid在庫はavailable 449件・assigned 1件。既存の`recall_pending`1件は`2026-10-26T06:42:16Z`に作成された記録で、今回のログイン後テストに伴う新規割り当てではない。Play署名済みの旧アプリ・新アプリをエミュレーターへ導入し、内部テスト参加同意からのストア導入・引き換え・購入復元を継続中。
