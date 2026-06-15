# Stocky 要件定義 v7（Flutter + Firebase Family Sync / Monetization Updated）

作成日: 2026-05-28

## 1. プロダクト概要

Stocky は、家庭内で共有するシンプルな在庫・買い物管理モバイルアプリです。

目的は、厳密な在庫数を管理することではなく、家族が「今あるもの」と「買うもの」をすばやく共有し、買い忘れを減らすことです。

中心操作は以下の 1 つに絞ります。

- アイテムをタップすると「あるもの」と「買うもの」の間を移動する

MVP から家族共有を実現するため、複数端末で 1 つのボードを共有できる構成にします。

## 2. 技術方針

### 2.1 採用技術

| 領域 | 採用技術 |
|---|---|
| アプリフレームワーク | Flutter |
| 言語 | Dart |
| 状態管理 | Riverpod |
| ルーティング | go_router |
| 認証 | Firebase Auth |
| データベース | Cloud Firestore |
| ローカル設定 | Hive |
| 画像アセット | assets/images |
| サンプルデータ | JSON asset |
| セキュリティ | Firestore Security Rules / Firebase App Check |
| テスト | flutter_test / Firebase Emulator Suite / unit test |
| 課金 | アプリ内課金（Plus: 買い切り） |

### 2.2 採用しない技術

MVP では以下を採用しません。

- drift
- SQLite 独自同期
- Firebase Storage
- Cloud Functions
- Web / PWA
- アフィリエイト導線
- 外部 EC リンク
- 広告 SDK
- アナリティクス SDK
- 複数ボード機能
- サブスクリプション課金

### 2.3 drift を外す理由

MVP から複数端末共有を実現するため、主データベースは Firestore に統一します。

drift と Firestore を二重管理すると、以下の問題が発生します。

- 同期処理が複雑になる
- 削除反映が複雑になる
- 競合解決が必要になる
- Codex CLI に実装させる範囲が広がる
- セキュリティレビュー対象が増える

そのため、MVP では drift を使いません。  
Hive はローカル設定のみに使用します。

## 3. 認証・共有方針

### 3.1 初回利用

初回起動時は Firebase Auth の匿名ログインで開始します。

ユーザー体験としては「ログインなしで即利用」に見せます。

```text
アプリ起動
→ 匿名ログイン
→ 初期ボード作成
→ サンプルデータ確認
→ 利用開始
```

### 3.2 アカウント保護

設定画面から、匿名アカウントをメールアドレス / パスワードに昇格できます。

目的:

- 機種変更時のデータ保持
- 複数端末での利用継続
- 家族共有ボードの復元

### 3.3 家族共有

家族共有は、招待リンクまたは QR コードで実現します。

```text
設定
→ 家族を招待
→ QRコードを表示 / 招待リンクをコピー
→ 家族がQRコードまたはリンクを開く
→ 同じ board に参加
```

招待されたユーザーも、まずは匿名ログインで参加できます。  
必要に応じて後からメール / パスワード登録できます。

### 3.4 QRコード招待

QRコードは、招待リンクを画像化したものとして扱います。

内部的には招待リンクと同じ `inviteId` を使います。

```text
stocky:///invite/{inviteId}
https://stocky.app/invite/{inviteId}
```

MVP では以下を実装します。

- QRコード表示
- 招待リンクコピー

OS共有シートはMVPでは使いません。送信手段はユーザーが任意に選び、Stockyはリンクコピーまでを提供します。

招待コード手入力は MVP では実装しません。  
理由は、短いコードは総当たりリスクがあり、試行回数制限など追加設計が必要になるためです。

### 3.5 家族メンバーと Firebase ユーザーの違い

Stocky では、以下を分けて扱います。

| 概念 | 役割 |
|---|---|
| Firebase User | 端末・認証・アクセス権管理 |
| Family Member | アプリ内の担当者表示 |

例:

- Firebase User: `uid_xxx`
- Family Member: `お母さん`, `父`, `子`, `ペット`

アイテムの担当者は Family Member に紐づけます。  
Firebase User と Family Member を 1:1 に固定しません。

## 4. セキュリティ基本方針

Stocky は MVP 段階からセキュリティを前提に設計します。

クライアントから Firestore に直接アクセスするため、フロントエンド上の表示制御をアクセス制御とは見なしません。  
実際のアクセス制御は Firestore Security Rules で行います。

### 4.1 セキュリティ方針

- 本番環境で Firestore test mode を使用しない
- すべての read / write は `request.auth != null` を必須にする
- `boardId` を知っているだけではデータを読めない設計にする
- `boards/{boardId}` 配下の `items` / `members` は、その board のメンバーだけが read / write できる
- `users/{uid}` は本人だけが read / write できる
- 招待リンクは十分長いランダム ID を使う
- 招待リンクには有効期限を設定する
- QRコードは招待リンクと同じ有効期限・権限制御を適用する
- 個人情報・機微情報を Firestore に保存しない
- アフィリエイト・外部 EC リンクは実装しない
- Firebase App Check を導入する
- Firebase Emulator Suite で Security Rules のテストを作成する

### 4.2 セキュリティ上の禁止事項

- `allow read, write: if true;` を使わない
- `allow read, write: if request.auth != null;` だけで board データを許可しない
- 全 board / 全 item を横断検索する設計にしない
- `boardId` を URL から推測可能な連番にしない
- 招待 ID を短い文字列にしない
- 招待コード手入力を MVP で実装しない
- メールアドレスなどを `boards` / `items` に保存しない
- Firebase Storage を MVP で使わない
- Cloud Functions を MVP で使わない
- フロントエンドの条件分岐をセキュリティ境界と見なさない

## 5. 課金・マネタイズ方針

### 5.1 基本方針

Stocky は、アフィリエイトではなく、アプリ内課金を中心にマネタイズします。

理由:

- モバイルアプリではアプリ内課金の方がユーザー体験と整合しやすい
- アフィリエイト導線は外部リンク・規約確認・計測・プライバシー対応が増える
- 買い物中に広告や外部ECリンクを出すと、Stockyの「すぐ使える」体験を壊しやすい
- MVPではコア体験の継続率確認を優先する

### 5.2 無料版

無料版の制限は以下です。

```text
無料版
- 1ボードのみ
- アイテム50件まで
- 家族メンバー3人まで
- 家族共有あり
- サンプルデータ利用可
```

補足:

- サンプルデータは35件のため、無料上限50件でもサンプル投入後に追加余地を確保できる
- 家族共有はStockyの本質なので無料版にも残す
- ボードは無料版・Plusともに1ボードのみ

### 5.3 Stocky Plus

Stocky Plus は買い切り課金のみとします。

```text
Stocky Plus
- 1ボードのみ
- アイテム無制限
- 家族メンバー無制限
```

### 5.4 価格方針

初期価格の目安:

```text
買い切り: 2,400円
```

価格はストア審査・運用費・競合状況を見て調整します。

理由:

- Firebaseの無料枠を超えた場合に運用費を吸収しやすい
- Stocky の利用頻度と家庭向けアプリの性質上、継続課金より買い切りの方が説明しやすい
- MVPでは課金仕様をシンプルに保ち、サブスクリプション課金は採用しない

### 5.5 実装上の注意

- Plus 状態はアプリ内課金の購入状態で管理する
- Stockyは1ボード運用のため、Plus購入状態はボード単位で適用する
- ボード内のいずれかのログインユーザーがPlusを購入または復元した場合、その唯一のボードに対してアイテム数・メンバー数の上限解除を反映する
- 購入復元自体は購入したFirebaseユーザーで行い、復元後に参加中のボードへPlus状態を反映する
- 購入復元導線を Settings に置く
- 課金情報を Firestore に保存する場合は、改ざん防止方針を別途検討する
- MVP初期では課金機能を後回しにし、無料版としてリリースしてもよい

## 6. Firestore データ構造

### 6.1 users/{uid}

```ts
type User = {
  uid: string
  email?: string
  createdAt: Timestamp
  lastLoginAt: Timestamp
  currentBoardId?: string
  isPlus?: boolean
  plusUpdatedAt?: Timestamp
}
```

### 6.2 boards/{boardId}

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
}
```

### 6.3 boards/{boardId}/items/{itemId}

```ts
type ItemCategory = "food" | "daily" | "baby" | "medical" | "pet" | "other"
type ItemStatus = "stock" | "shopping"

type Item = {
  id: string
  boardId: string
  name: string
  category: ItemCategory
  iconKey: string
  iconPath: string
  status: ItemStatus
  assignedMemberId?: string
  sortOrder: number
  isFavorite: boolean
  shoppingMoveCount: number
  statusUpdatedAt: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

`statusUpdatedAt` は、アイテムを買うもの/あるものとして登録した日時、または買うもの/あるものへ移動した日時を表します。名前編集、メンバー変更、お気に入り変更では更新しません。

### 6.4 boards/{boardId}/members/{memberId}

```ts
type FamilyMember = {
  id: string
  name: string
  avatarKey: string
  avatarPath: string
  sortOrder: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 6.5 invites/{inviteId}

```ts
type Invite = {
  id: string
  boardId: string
  createdBy: string
  expiresAt: Timestamp
  createdAt: Timestamp
  usedByUids?: string[]
}
```

### 6.6 planLimits

アプリ側で使用する制限値です。

```dart
class PlanLimits {
  static const freeMaxItems = 50;
  static const freeMaxMembers = 3;
  static const maxBoards = 1;
}
```

Plusの場合:

```dart
class PlusPlanLimits {
  static const maxItems = null; // unlimited
  static const maxMembers = null; // unlimited
  static const maxBoards = 1;
}
```

## 7. Hive の役割

Hive はローカル設定のみに使います。

```dart
const hiveKeys = {
  "currentBoardId": "currentBoardId",
  "selectedInventoryTab": "selectedInventoryTab",
  "themeMode": "themeMode",
  "themeColorKey": "themeColorKey",
};
```

Hive に保存しないもの:

- item 本体
- family member 本体
- board 本体
- 招待情報
- 個人情報
- 課金の正本

## 8. デザイン再現方針

アプリのデザインは、デザインモックを忠実に再現します。

参照ファイル:

```text
assets/images/design_mock.png
```

再現対象:

- Stocky のロゴ配置
- 余白量
- カードの角丸
- カードの影
- 背景色
- 買うもの / あるものの色分け
- アイテムカード内のアイコン配置
- 家族アバターの表示位置
- 追加モーダル
- 担当者選択モーダル
- Settings / メンバー管理画面

Flutter 実装では、モバイル操作に最適化して再構成します。

## 9. MVP 方針

### 9.1 やること

- Flutter モバイルアプリとして実装する
- Firebase匿名ログインで即利用できる
- メール / パスワードによるアカウント保護ができる
- QRコード / 招待リンクで家族が同じ board に参加できる
- Firestore で複数端末同期できる
- 1ボードのみ扱う
- 無料版はアイテム50件 / 家族メンバー3人まで
- Plusはアイテム無制限 / 家族メンバー無制限
- 「買うもの」「あるもの」の 2 状態だけを扱う
- タップで状態を切り替える
- 長押しで編集する
- 長押しメニューから削除する
- 家族アバターは丸型プリセット画像から選択できる
- アイテムごとに任意で担当者を設定できる
- アイテム登録時にカテゴリを選択できる
- カテゴリごとのアイテムアイコンを選択できる
- サンプルデータは初回に「登録する / しない」を選べる
- サンプルデータは JSON asset から Firestore に投入する
- Firestore Security Rules を実装する
- Firebase Emulator Suite で Rules テストを作成する

### 9.2 やらないこと

- 在庫数管理
- 「少ない」状態
- バーコード読み取り
- 正式な商品名・JAN コード管理
- 商品 DB 連携
- ユーザー画像アップロード
- 詳細な操作履歴
- Firebase Storage
- Cloud Functions
- drift
- SQLite 独自同期
- アフィリエイト導線
- 外部 EC サイトへの購入リンク
- プッシュ通知
- 広告 SDK
- アナリティクス SDK
- 複数ボード
- 招待コード手入力

## 10. 主要画面

### 10.1 Inventory 画面

モバイルアプリでは、画面上部にタブを表示します。

- 買うもの
- あるもの

各タブには以下を表示します。

- 件数
- アイテムカード一覧
- 追加ボタン

アイテムカードは以下の構成にします。

```text
[アイテムアイコン] アイテム名        [担当者アバター or 未割当アイコン]
[カテゴリアイコン] カテゴリ名   [時計アイコン] M/D H:mm 更新
```

状態カラーはカード左端のステータスバーで表現します。

- 買うもの: コーラル / 赤系
- あるもの: ミント / 緑系

無料版の上限に近づいた場合は、追加画面またはアイテム追加ボタン付近で控えめに表示します。

```text
無料版では50件まで登録できます
現在: 46 / 50
```

### 10.2 アイテム追加画面

モバイルでは、モーダルボトムシートで実装します。

入力項目:

- アイテム名
- カテゴリ
- アイテムアイコン
- 初期状態
  - 買うもの
  - あるもの
- 担当者（任意）

数量入力は実装しません。

無料版で50件に達している場合:

- 追加ボタンを無効化
- Plus案内を表示

### 10.3 担当者選択モーダル

表示内容:

- 登録済み家族メンバーの丸型アバター
- 担当なし
- キャンセル
- 決定

無料版で家族メンバー3人に達している場合:

- メンバー追加ボタンを無効化
- Plus案内を表示

### 10.4 Settings 画面

項目:

- データを保護（アカウント登録）
- 家族を招待
  - QRコードを表示
  - 招待リンクをコピー
- 家族メンバー管理
- Stocky Plus
  - Plus購入シミュレーション
  - 購入を復元
  - 現在のプラン表示
- サンプルデータの追加
- サンプルデータの削除
- データ初期化
- アプリ情報

### 10.5 初回サンプルデータ確認モーダル

表示内容:

```text
サンプルデータを追加しますか？
アプリの使い勝手をすぐに確認できるよう、いくつかの一時的なデータを用意します。
```

選択肢:

- いいえ
- はい

挙動:

- はい: 初期サンプルデータを現在の board の Firestore に登録する
- いいえ: 空の状態で開始する
- 一度選択したら board に `sampleDecisionMade = true` を保存する

## 11. 操作仕様

### 11.1 タップ操作

アイテムカードをタップすると状態を切り替えます。

```text
stock -> shopping
shopping -> stock
```

確認ダイアログは出しません。

### 11.2 長押し操作

アイテムカードを長押しするとコンテキストメニューを表示します。

MVP のメニュー項目:

- 担当者を設定
- 編集
- 削除

アフィリエイト / 外部EC導線は実装しません。

### 11.3 担当者アバター操作

アイテムカード右端の家族アバターをタップすると、担当者選択モーダルを表示します。

## 12. カテゴリ・アイコン仕様

### 12.1 カテゴリ

アイテム登録時に、以下の 6 カテゴリから選択します。

| 表示名 | category key | 画像例 |
|---|---|---|
| 食材 | `food` | `assets/images/default/default_food.png` |
| 日用品 | `daily` | `assets/images/default/default_daily.png` |
| ベビー用品 | `baby` | `assets/images/default/default_baby.png` |
| 医薬・衛生用品 | `medical` | `assets/images/default/default_medical.png` |
| ペット用品 | `pet` | `assets/images/default/default_pet.png` |
| その他 | `other` | `assets/images/default/default_other.png` |

`assets/images/category/` 配下のカテゴリ専用画像は現在の実ファイル配置には存在しません。カテゴリ表示には Material Icon または `assets/images/default/default_*.png` を使います。

### 12.2 アイテムアイコン

カテゴリごとに複数のアイテムアイコン画像を用意します。
共有データとしてFirestoreに保存する画像パスは、`assets/images` 配下のプリセット画像のみとします。
端末内から選択した画像は別端末へ共有できないため、保存時にカテゴリのデフォルト画像へ置き換えます。

格納形式:

```text
assets/images/food/food_001.png
assets/images/daily/daily_001.png
assets/images/baby/baby_001.png
assets/images/medical/medical_001.png
assets/images/pet/pet_001.png
assets/images/other/other_001.png
assets/images/default/default_food.png
```

### 12.3 家族アバター

家族アバターは丸型プリセットからユーザーが選択できる形式にします。
共有データとしてFirestoreに保存するアバター画像パスは、`assets/images/avatar` 配下のプリセット画像のみとします。
端末内から選択した画像は別端末へ共有できないため、保存時に担当者なし画像へ置き換えます。

画像格納例:

```text
assets/images/avatar/mother.png
assets/images/avatar/grandma.png
assets/images/avatar/daughter.png
assets/images/avatar/farther.png
assets/images/avatar/san.png
assets/images/avatar/grandpa.png
assets/images/avatar/user.png
```

## 13. デザインシステム

`assets/images/design_mock.png` をベースに、以下のデザインシステムで実装します。

```dart
class AppColors {
  static const background = Color(0xFFFBF9F8);
  static const surface = Color(0xFFFBF9F8);
  static const surfaceContainerLowest = Color(0xFFFFFFFF);
  static const surfaceContainerLow = Color(0xFFF6F3F2);
  static const surfaceContainer = Color(0xFFF0EDED);
  static const onSurface = Color(0xFF1B1C1C);
  static const primary = Color(0xFF9F3E41);
  static const primaryContainer = Color(0xFFF27E7E);
  static const secondary = Color(0xFF126C40);
  static const secondaryContainer = Color(0xFFA1F5BC);
  static const outline = Color(0xFF897271);
  static const outlineVariant = Color(0xFFDCC0BF);
}
```

テーマカラー変更は実装対象外とします。  
状態色の意味は固定で維持します。

- 買うもの: 赤 / コーラル系
- あるもの: 緑 / ミント系

Plusでもテーマカラー変更は提供しません。

## 14. サンプルデータ

サンプルデータは JSON asset として管理します。

```text
assets/stocky_sample_data_35_items.json
```

現在のサンプルデータは35件です。

無料版の上限は50件なので、サンプル投入後も追加余地を確保します。

## 15. ルーティング設計

go_router を使用します。

```text
/
  -> AuthGate

/inventory
  -> InventoryPage

/settings
  -> SettingsPage

/settings/members
  -> MemberManagementPage

/settings/account
  -> AccountProtectionPage

/settings/plus
  -> PlusPage

/settings/about
  -> AboutPage

/settings/invite
  -> InviteCreatePage

/invite/:inviteId
  -> InviteJoinPage
```

アイテム追加・担当者選択・QRコード表示は、基本的にページ遷移ではなく、モーダルボトムシートまたはダイアログで扱います。

## 16. Riverpod 設計

### 16.1 Provider 方針

- FirebaseAuth インスタンスは Provider で提供する
- FirebaseFirestore インスタンスは Provider で提供する
- Repository は Provider で提供する
- 課金状態は Provider で提供する
- 画面状態は Notifier / AsyncNotifier / StreamProvider で管理する
- UI から Firestore を直接呼ばない
- UI から Hive を直接呼ばない

### 16.2 Provider 例

```dart
final firebaseAuthProvider = Provider<FirebaseAuth>((ref) {
  return FirebaseAuth.instance;
});

final firestoreProvider = Provider<FirebaseFirestore>((ref) {
  return FirebaseFirestore.instance;
});

final itemRepositoryProvider = Provider<ItemRepository>((ref) {
  final firestore = ref.watch(firestoreProvider);
  return ItemRepository(firestore);
});

final boardItemsProvider =
    StreamProvider.family<List<StockItem>, String>((ref, boardId) {
  final repository = ref.watch(itemRepositoryProvider);
  return repository.watchItems(boardId);
});
```

## 17. Firestore Security Rules 方針

Firestore Security Rules は MVP でも必須実装とします。

### 17.1 基本ルール案

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isBoardMember(boardId) {
      return isSignedIn()
        && request.auth.uid in get(/databases/$(database)/documents/boards/$(boardId)).data.memberUids;
    }

    function isBoardOwner(boardId) {
      return isSignedIn()
        && request.auth.uid == get(/databases/$(database)/documents/boards/$(boardId)).data.ownerUid;
    }

    match /users/{uid} {
      allow read, create, update: if isSignedIn() && request.auth.uid == uid;
      allow delete: if false;
    }

    match /boards/{boardId} {
      allow read: if isBoardMember(boardId);
      allow create: if isSignedIn()
        && request.resource.data.ownerUid == request.auth.uid
        && request.auth.uid in request.resource.data.memberUids;
      allow update: if isBoardMember(boardId);
      allow delete: if isBoardOwner(boardId);

      match /items/{itemId} {
        allow read, create, update, delete: if isBoardMember(boardId);
      }

      match /members/{memberId} {
        allow read, create, update, delete: if isBoardMember(boardId);
      }
    }

    match /invites/{inviteId} {
      allow read: if isSignedIn()
        && resource.data.expiresAt > request.time;
      allow create: if isSignedIn()
        && isBoardMember(request.resource.data.boardId);
      allow update: if false;
      allow delete: if false;
    }
  }
}
```

### 17.2 Rules テスト要件

Firebase Emulator Suite を使い、最低限以下をテストします。

- 未ログインユーザーは何も読めない
- ログイン済みでも他人の board は読めない
- board member は自分の board の items を読める
- board member は自分の board の items を更新できる
- board member でないユーザーは items を読めない
- users/{uid} は本人だけ読める
- 期限切れ invite は読めない
- inviteId を知っていても期限切れなら参加できない

## 18. アーキテクチャ

feature-first を基本にします。

```text
lib/
  main.dart
  app/
    stocky_app.dart
    router.dart
    theme.dart
  core/
    constants/
    firebase/
    storage/
    assets/
    purchase/
    errors/
  features/
    auth/
      data/
      domain/
      presentation/
    boards/
      data/
      domain/
      presentation/
    inventory/
      data/
      domain/
      presentation/
    members/
      data/
      domain/
      presentation/
    invites/
      data/
      domain/
      presentation/
    settings/
      data/
      domain/
      presentation/
    sample_data/
      data/
      domain/
    plus/
      data/
      domain/
      presentation/
  shared/
    widgets/
    utils/
assets/
  images/
  stocky_sample_data_35_items.json
```

## 19. Codex CLI 向け実装指示

### 19.1 前提

- Flutter アプリとして実装する
- 状態管理は Riverpod を使う
- ルーティングは go_router を使う
- 主データは Firebase Auth + Firestore で管理する
- Hive はローカル設定のみに使う
- drift は使わない
- 画像ファイルは `assets/images` から参照する
- 共有される画像パスはプリセットassetに限定し、端末内画像のローカルパスをFirestoreへ保存しない
- サンプルデータは `assets/stocky_sample_data_35_items.json` から読み込む
- UI は `assets/images/design_mock.png` を忠実に再現する
- 1ボードのみ実装する
- 無料版はアイテム50件 / 家族メンバー3人まで
- Plusは買い切りで、アイテム無制限 / 家族メンバー無制限
- QRコード招待と招待リンクを実装する
- 招待コード手入力は実装しない
- Firestore Security Rules を実装する
- Firebase Emulator Suite で Rules テストを作る
- Firebase App Check を導入する
- アフィリエイト導線は実装しない
- 外部 EC リンクは実装しない
- ユーザー画像アップロードは MVP で実装しない

### 19.2 推奨 pubspec 依存関係

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.0.0
  riverpod_annotation: ^2.0.0
  go_router: ^14.0.0
  firebase_core: ^3.0.0
  firebase_auth: ^5.0.0
  cloud_firestore: ^5.0.0
  firebase_app_check: ^0.3.0
  hive: ^2.0.0
  hive_flutter: ^1.0.0
  qr_flutter: ^4.0.0
  in_app_purchase: ^3.0.0
  freezed_annotation: ^2.0.0
  json_annotation: ^4.0.0

dev_dependencies:
  build_runner: ^2.0.0
  riverpod_generator: ^2.0.0
  freezed: ^2.0.0
  json_serializable: ^6.0.0
  flutter_test:
    sdk: flutter
```

実際のバージョンは作成時点の最新安定版に合わせます。

## 20. Codex CLI 用タスクリスト

```md
# Stocky Flutter + Firebase 実装タスクリスト

## Phase 0: 初期セットアップ
- [ ] Flutter プロジェクトを作成する
- [ ] Riverpod を導入する
- [ ] Firebase Core を導入する
- [ ] Firebase Auth を導入する
- [ ] Cloud Firestore を導入する
- [ ] Firebase App Check を導入する
- [ ] Hive を導入する
- [ ] go_router を導入する
- [ ] qr_flutter を導入する
- [ ] in_app_purchase を導入する
- [ ] build_runner 系パッケージを導入する
- [ ] assets/images を pubspec.yaml に登録する
- [ ] assets/stocky_sample_data_35_items.json を pubspec.yaml に登録する

## Phase 1: アセット
- [ ] assets/images/design_mock.png を配置する
- [ ] assets/images/default/*.png を配置する
- [ ] assets/images/food/*.png を配置する
- [ ] assets/images/daily/*.png を配置する
- [ ] assets/images/baby/*.png を配置する
- [ ] assets/images/medical/*.png を配置する
- [ ] assets/images/pet/*.png を配置する
- [ ] assets/images/other/*.png を配置する
- [ ] assets/images/avatar/*.png を配置する
- [ ] assets/stocky_sample_data_35_items.json を配置する

## Phase 2: Firebase / セキュリティ
- [ ] Firebase プロジェクトを作成する
- [ ] FlutterFire CLI で Firebase 設定を生成する
- [ ] 匿名ログインを有効化する
- [ ] メール / パスワードログインを有効化する
- [ ] Firestore を作成する
- [ ] Firestore Security Rules を作成する
- [ ] Firebase Emulator Suite を導入する
- [ ] Security Rules テストを作成する
- [ ] Firebase App Check を設定する
- [ ] 本番環境で test mode になっていないことを確認する

## Phase 3: デザイン基盤
- [ ] AppColors を定義する
- [ ] AppTextStyles を定義する
- [ ] AppTheme を定義する
- [ ] 共通 Card / Button / Chip / BottomSheet を作る
- [ ] design_mock.png に合わせて余白・角丸・影を調整する

## Phase 4: 型 / Repository
- [ ] UserProfile model を作る
- [ ] Board model を作る
- [ ] StockItem model を作る
- [ ] FamilyMember model を作る
- [ ] Invite model を作る
- [ ] Plan model を作る
- [ ] AuthRepository を作る
- [ ] BoardRepository を作る
- [ ] ItemRepository を作る
- [ ] MemberRepository を作る
- [ ] InviteRepository を作る
- [ ] SampleDataRepository を作る
- [ ] PurchaseRepository を作る
- [ ] SettingsRepository を作る

## Phase 5: Riverpod
- [ ] firebaseAuthProvider を作る
- [ ] firestoreProvider を作る
- [ ] hiveProvider を作る
- [ ] repository providers を作る
- [ ] authControllerProvider を作る
- [ ] boardControllerProvider を作る
- [ ] inventory providers を作る
- [ ] member providers を作る
- [ ] invite providers を作る
- [ ] plus providers を作る
- [ ] settings providers を作る

## Phase 6: 認証 / ボード初期化
- [ ] 初回起動時に匿名ログインする
- [ ] users/{uid} を作成する
- [ ] 初回 board を作成する
- [ ] board.memberUids に uid を追加する
- [ ] currentBoardId を Hive に保存する
- [ ] メール / パスワード昇格処理を作る

## Phase 7: サンプルデータ
- [ ] JSON asset を読み込む処理を作る
- [ ] categories を扱う定義を作る
- [ ] items を Firestore に投入する
- [ ] sampleDecisionMade を board に保存する
- [ ] sampleImported を board に保存する
- [ ] 重複投入を防ぐ

## Phase 8: Inventory UI
- [ ] InventoryPage を作る
- [ ] 買うもの / あるものタブを作る
- [ ] ItemCard を作る
- [ ] Firestore Stream で items を購読する
- [ ] status ごとに表示を分ける
- [ ] タップで status を切り替える
- [ ] 長押しメニューを作る
- [ ] 担当者アバターを表示する
- [ ] 無料版50件上限を表示・制御する

## Phase 9: アイテム追加 / 編集 / 削除
- [ ] AddItemBottomSheet を作る
- [ ] アイテム名入力を作る
- [ ] CategoryPicker を作る
- [ ] IconPicker を作る
- [ ] 初期状態選択を作る
- [ ] 担当者選択を作る
- [ ] アイテム追加処理を作る
- [ ] アイテム編集処理を作る
- [ ] アイテム削除処理を作る
- [ ] 削除 Undo を検討する
- [ ] 無料版50件上限到達時にPlus案内を出す
- [ ] Amazon / 楽天 / 外部 EC リンクを実装していないことを確認する

## Phase 10: メンバー管理
- [ ] MemberManagementPage を作る
- [ ] MemberAvatar を作る
- [ ] AvatarPresetGrid を作る
- [ ] メンバー追加処理を作る
- [ ] メンバー編集処理を作る
- [ ] メンバー削除処理を作る
- [ ] 無料版3人上限を制御する
- [ ] ItemCard から担当者選択を開けるようにする

## Phase 11: 家族招待
- [ ] inviteId を安全なランダム文字列で生成する
- [ ] invites/{inviteId} を作成する
- [ ] expiresAt を設定する
- [ ] QRコード表示を作る
- [ ] 招待リンクコピーを作る
- [x] OS共有シートは使わず、リンクコピーのみ提供する
- [ ] InviteJoinPage を作る
- [ ] 招待リンクから board に参加する処理を作る
- [ ] board.memberUids に参加者 uid を追加する
- [ ] 期限切れ invite を拒否する
- [ ] 正式リリース前後に招待リンクを HTTPS 形式へ移行する
  - 未インストール時は App Store / Google Play へ案内する
  - インストール済みの場合は Universal Links / Android App Links でアプリを開く
  - 初回インストール後に inviteId を引き継ぐ方法を検討する

## Phase 12: Plus / 課金
- [ ] PlusPage を作る
- [ ] 買い切り商品IDを定義する
- [ ] in_app_purchase の購入処理を作る
- [ ] 購入復元処理を作る
- [ ] Plus状態Providerを作る
- [ ] Plus状態に応じてアイテム数制限を切り替える
- [ ] Plus状態に応じて家族メンバー数制限を切り替える

Plusの本番購入処理は後続対応とし、当面は他の共有・永続化機能を優先します。テーマカラー変更は実装対象外です。

## Phase 13: Settings
- [ ] SettingsPage を作る
- [ ] アカウント保護画面を作る
- [ ] 家族招待 UI を作る
- [ ] 家族メンバー管理導線を作る
- [ ] Stocky Plus 導線を作る
- [ ] サンプルデータ再登録を作る
- [ ] データ初期化を作る
- [ ] アプリ情報画面を作る

## Phase 13.5: Plus / HTTPS 招待リンク以外の優先実装
- [x] MemberRepository を作り、boards/{boardId}/members を Firestore の正本にする
- [x] メンバー追加・編集・削除を Firestore に保存する
- [x] メンバー削除時に、該当メンバーが割り当てられた item.assignedMemberId を解除する
- [x] users/{uid} を作成し、匿名 / メール登録済み状態と最終利用 boardId を保存する
- [x] 入力メールアドレスに応じて、メール / パスワード登録または既存アカウントログインを自動処理する
- [x] users/{uid}.currentBoardId からログイン済みユーザーの board を復元する
- [x] sampleImported / sampleDecisionMade を board ドキュメントに保存する
- [x] Hive の sampleSeeded はローカル補助情報に限定する
- [x] Firebase Emulator Suite で Security Rules テストを追加する
- [x] Firebase App Check をコード初期化する
- [ ] Firebase Console 側で App Check 本番プロバイダを有効化する
- [ ] Apple Developer Program 登録後、iOS App Check に App Attest と DeviceCheck fallback を設定する
- [ ] iOS App Check 設定後、Firestore enforcement を有効化できるかモニタリングで確認する

## Phase 14: テスト
- [x] Security Rules テストを作る
- [ ] sortOrder のテストを作る
- [x] status 切り替えのテストを作る
- [x] sample data import のテストを作る
- [ ] repository のテストを作る
- [x] 無料版上限のテストを作る
- [ ] Plus状態のテストを作る
- [ ] 主要 Widget の smoke test を作る

## Phase 15: ビルド
- [ ] Android ビルド確認
- [ ] iOS ビルド確認
- [ ] アプリアイコン設定
- [ ] スプラッシュ画面設定
```

## 21. 完了条件

MVP 完了条件は以下です。

- Flutter モバイルアプリとして起動できる
- `assets/images/design_mock.png` に近い UI が再現されている
- 匿名ログインで即利用できる
- メール / パスワードでデータ保護できる
- QRコード / 招待リンクで家族が同じ board に参加できる
- 複数端末で同じ board の状態が同期される
- 1ボードのみで運用できる
- 無料版でアイテム50件まで制限できる
- 無料版で家族メンバー3人まで制限できる
- Plusでアイテム無制限になる
- Plusで家族メンバー無制限になる
- 初回にサンプルデータ追加を選択できる
- サンプルデータが Firestore に保存される
- 「買うもの」と「あるもの」を表示できる
- アイテムをタップで相互移動できる
- アイテムを追加できる
- アイテムを編集できる
- アイテムを削除できる
- 6カテゴリからカテゴリ選択できる
- カテゴリごとのアイテムアイコンを選択できる
- 家族メンバーを丸型プリセットアバターから登録できる
- アバターの見た目を選択できる
- アイテムごとに担当者を任意設定できる
- Settings からアカウント保護・家族招待・メンバー管理・Stocky Plus・データ初期化・アプリ情報を開ける
- Firestore Security Rules が実装されている
- Firebase Emulator Suite で Rules テストがある
- Firebase App Check が設定されている
- Amazon / 楽天 / 外部 EC / アフィリエイト導線が存在しない
- Android / iOS のビルドが通る
