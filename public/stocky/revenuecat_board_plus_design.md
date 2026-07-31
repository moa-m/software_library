# RevenueCat board単位 NUUPAMO Plus設計

> 表示名は「NUUPAMO Plus」を使用します。既存購入を引き継ぐため、Entitlement ID と商品IDに含まれる `stocky` は内部識別子として変更しません。

## 方針

Stocky Plus の購入・復元・サブスクリプション検証は RevenueCat で行う。

RevenueCat の App User ID には Firebase Auth の `uid` を使う。

MVP ではクライアント側で RevenueCat entitlement を直接確認して Stocky Plus 表示を更新する。ただし、共有リスト全体の上限解除はクライアント書き込みを正本にしない。

最終的な Stocky Plus 正本は `boards/{boardId}` に保存し、RevenueCat Webhook を受けた Cloud Functions が Admin SDK で更新する。

iOS 課金を先行して実装した後、AndroidもGoogle Play商品、RevenueCatの商品カタログ設定、Google Developer Notifications接続、内部テスト配布での課金ライフサイクル確認まで進める。

Stocky Plusのメンバー無制限は、`members`内のアプリ利用者（`memberType: "user"`）とその他のメンバー（`memberType: "managed"`）の両方を対象とする。無料プランの3人上限も両者の合計で判定する。

## 現在の実装状況

- iOS の RevenueCat App、Entitlement、Offering、月額 / 年額商品を設定済み。
- Android / iOS の RevenueCat Public SDK Keyはアプリへ組み込み済み。必要時は対応する`dart-define`で上書きできる。
- `purchases_flutter` による初期化、商品取得、購入、復元を実装済み。
- Firebase Auth の `uid` を起動時とメールアカウント切り替え後の RevenueCat App User ID に設定済み。
- App Store Connect からの商品取得と日本円表示をiOS実機で確認済み。
- board 単位の Stocky Plus 状態同期は実装・デプロイ済み。RevenueCat Test Webhookの`200`応答を確認済み。
- iOS実機のSandboxで購入を完了し、購入者本人へのStocky Plus反映を確認済み。
- 購入者と同じboardへ参加した別のAndroidユーザーにもStocky Plusが反映されることを確認済み。
- iOS Sandboxの自動更新、更新終了後の期限切れ、board全体のStocky Plus解除を確認済み。
- iOS Sandboxで有効な購入を復元し、Stocky Plusが維持されることを確認済み。
- Androidアプリのdebugビルドと、アップロードキーで署名したRelease AAB生成を確認済み。
- Google Playで月額 / 年額の自動更新商品を有効化し、RevenueCatのAndroid App、サービスアカウント認証、商品取り込み、`stocky_plus` Entitlement、Default Offeringへの紐付けを設定済み。
- Google Developer Notificationsを接続し、Play Consoleからのテスト通知送信を確認済み。
- Androidの内部テスト`version: 1.0.0+4`で定期購入・解約・自動更新・購入復元・期限切れを確認済み。

2026-07-14 更新:

- `revenueCatWebhook`をCloud Functions for Firebase（第2世代 / Node.js 22 / `asia-northeast1`）へデプロイ済み。
- Authorization秘密値はFirebase Secret Managerの`REVENUECAT_WEBHOOK_AUTH`で管理する。
- WebhookイベントIDを`revenuecatWebhookEvents/{eventId}`へ保存し、重複処理を防止する。
- `boards/{boardId}.plus`へ購入者ごとの状態とboard全体の`isActive`を保存する。
- クライアントによるboard作成時のStocky Plus状態偽装をFirestore Security Rulesで拒否する。
- FlutterはRevenueCatの購入者本人状態とFirestoreのboard状態を併用する。
- RevenueCat DashboardでのWebhook登録とTestイベント受信は完了。Sandbox購入、購入復元、自動更新、手動解約、期限切れ、別boardメンバーへの反映を確認済み。

## RevenueCat 設定

```text
Entitlement ID: stocky_plus
Offering ID: default
Monthly product ID: stocky_plus_monthly
Yearly product ID: stocky_plus_yearly
```

## Firestore データ案

```ts
type BoardPlus = {
  isActive: boolean
  source: "revenuecat"
  entitlementId: "stocky_plus"
  activePurchaserUids: string[]
  purchasers: Record<string, {
    isActive: boolean
    productId?: string
    environment?: "SANDBOX" | "PRODUCTION"
    expirationAt?: Timestamp
    eventTimestampMs: number
    lastEventId: string
    updatedAt: Timestamp
  }>
  updatedAt: Timestamp
}
```

```ts
type Board = {
  id: string
  name: string
  ownerUid: string
  memberUids: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
  sampleImported: boolean
  sampleDecisionMade: boolean
  plus?: BoardPlus
}
```

## Cloud Functions 処理

1. RevenueCat Webhook を HTTPS Function で受け取る。
2. Webhook の認証ヘッダーまたは secret を検証する。
3. event の `app_user_id` を Firebase Auth の `uid` として扱う。
4. `users/{uid}.currentBoardId` を読む。
5. 対象 board が存在し、`uid` が `memberUids` に含まれることを確認する。
6. `stocky_plus` entitlement がactiveになるイベントでは購入者状態を有効にする。
7. cancellationでは有効期限まで権限を維持し、expiration / refundで購入者状態を無効にする。
8. 同一board内にactiveな購入者が1人以上いれば`boards/{boardId}.plus.isActive = true`にする。
9. イベントIDと時刻で重複・古いイベントを無視する。

### 共有リスト退出時

1. Callable Function `leaveSharedBoard`で認証済みuidを受け取る。
2. `users/{uid}.currentBoardId`と`previousBoardId`を検証する。既存ユーザーに`previousBoardId`がない場合は、本人が所有する元boardをメンバー一覧から復元する。
3. 現在の共有boardからuidを外し、`previousBoardId`を現在のboardへ戻す。
4. 退出者がStocky Plus購入者なら、購入者レコードを共有boardから元boardへ移し、両boardの`activePurchaserUids`と`isActive`を再計算する。
5. 退出者が購入者でなければ、元boardの課金状態をそのまま適用する。
6. 以上をFirestoreトランザクションで実行し、クライアントから`plus`を直接変更しない。

## Security Rules 方針

- board member は `boards/{boardId}.plus` を read できる。
- クライアントは `boards/{boardId}.plus` を create / update できない。
- `plus` 更新は Cloud Functions の Admin SDK のみ行う。
- フロントエンドの RevenueCat 判定は即時 UI 更新用であり、board-wide Stocky Plus のセキュリティ境界にしない。

## クライアント段階実装

実装済み:

- `purchases_flutter` で RevenueCat を初期化する。
- Firebase Auth の `uid` を RevenueCat App User ID にする。
- `CustomerInfo.entitlements.active["stocky_plus"]` から購入者本人の Stocky Plus 状態を読む。
- `Purchases.getOfferings()` で `default` Offering を取得する。
- `Purchases.purchase(PurchaseParams.package(package))` で購入する。
- `Purchases.restorePurchases()` で復元する。
- iOSではStocky Plus画面の「契約内容の確認・解約」からStoreKitの管理画面を表示する。
- 管理画面はSandboxテストと本番の解約・プラン管理で共通利用する。
- RevenueCatと`boards/{boardId}.plus`の商品ID・有効期限から、設定画面に`Stocky Plus/月額`または`Stocky Plus/年額`を表示する。
- Stocky Plus画面の購入中商品に購入済み、有効期限、自動更新停止状態を表示する。
- `PRODUCT_CHANGE` Webhookの`new_product_id`を購入者ごとの`pendingProductId`として保存する。
- 変更予約中は現在の商品を「購入済み・現在有効」、変更先を「変更予約中・次回更新から適用」と表示する。
- 設定画面では変更予約を`Stocky Plus/月額（次回更新から年額）`の形式で表示し、変更先商品の再購入操作を無効化する。
- `RENEWAL`、新規購入、解約、期限切れ、返金を受信したら、適用済みまたは無効になった変更予約を削除する。
- 月額と年額はいずれも自動更新サブスクリプションとして案内する。
- 月額 / 年額カードのタップはプラン選択のみとし、独立した購入ボタンから購入処理を開始する。
- Stocky Plusの新規購入・購入復元・プラン変更は、Firebase匿名ユーザーへメール認証をリンクするか、既存アカウントへログインした後に許可する。
- 既存の匿名状態Stocky Plus購入者はentitlementを維持し、アカウント登録を案内する。登録前も契約管理・解約は利用可能にする。
- `activePurchaserUids`に現在のuidが含まれないメンバーには、Stocky Plus特典が適用中であることだけを表示する。商品ID、有効期限、購入・復元・契約管理は表示しない。
- RevenueCatの購入復元はサブスクリプション権利の復元であり、別uidが所有するStockyデータの復元や統合には使用しない。
