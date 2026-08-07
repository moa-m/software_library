# NUUPAMO 要件定義 v7（Flutter + Firebase Family Sync / Monetization Updated）

> 旧名称の「Stocky」「Stocky Home」は NUUPAMO を指します。既存利用者との互換性を保つため、`stocky` を含むURL・アプリID・FirebaseプロジェクトID・課金商品IDなどの内部識別子は変更しません。

作成日: 2026-05-28

## 1. プロダクト概要

NUUPAMO（ヌーパモ）は、家庭内で共有するシンプルな在庫・買い物管理モバイルアプリです。

目的は、厳密な在庫数を管理することではなく、招待されたメンバーが「今あるもの」と「買うもの」をすばやく共有し、買い忘れを減らすことです。

中心操作は以下の 1 つに絞ります。

- アイテムをタップすると「あるもの」と「買うもの」の間を移動する

MVP からリスト共有を実現するため、複数端末で 1 つのリストを共有できる構成にします。

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
| 課金 | アプリ内課金（Stocky Plus: 月額 / 年額サブスクリプション） |

### 2.2 採用しない技術

MVP では以下を採用しません。

- drift
- SQLite 独自同期
- Firebase Storage
- Cloud Functions（ただし RevenueCat の課金状態を board 単位へ安全に反映する用途は例外として採用可）
- Web / PWA
- アフィリエイト導線
- 外部 EC リンク
- 広告 SDK
- アナリティクス SDK
- 複数リスト機能
- 買い切り課金

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

初回起動時は Firebase Auth の匿名ログインで内部認証を開始し、以下の3画面を順に表示します。

ユーザー体験としては「ログインなしで即利用」に見せます。

```text
アプリ起動
→ 匿名ログイン
→ アカウント登録 / ログイン（あとで設定可能）
→ プロフィール登録（必須）
→ 初期リスト作成
→ サンプルデータ選択
→ 利用開始
```

プロフィールは名前、アバター、背景色を登録し、`users/{uid}.profile`を正本として本人に紐付いた全リストへ同期します。保存から次画面への遷移中はローディング表示を出します。既存アカウントに保存済みリストがある場合、未登録のプロフィールだけを補い、サンプルデータ選択は表示しません。

アカウント登録 / ログインには設定画面を流用せず、データ引き継ぎの目的を先に伝えるオンボーディング専用画面を使用します。プロフィール画面では内部の共有仕様を前提にせず、「アプリ内で表示する名前と画像」と説明します。アバターは5列、背景色は6列のグリッドから選択します。

### 3.2 アカウントとデータ引き継ぎ

設定画面から、匿名アカウントをメールアドレス / パスワードに昇格できます。

ユーザー向けの基本名称は「在庫・買い物リスト」とします。「このリスト」「元のリスト」のような単独表記は避け、参加前・招待先・共有中など、対象を具体的に示します。Firestoreの型・フィールドなど、内部識別子に限り`board`を使用します。

ユーザー向けには「匿名利用」ではなく「アカウント未登録」と表示します。未登録でも変更内容はFirestoreへ自動保存・共有されますが、機種変更や再インストール後に本人がデータへ戻るにはアカウント登録が必要です。

- 新規登録は現在の匿名ユーザーへ認証情報をリンクし、uidと現在データを維持する
- 既存アカウントへのログインは新規登録と分離する
- 既存ログイン前に、現在の未登録データは統合されずログイン先データへ切り替わることを確認する
- パスワード再設定メールを送信できるようにする

目的:

- 機種変更時のデータ保持
- 複数端末での利用継続
- 共有リストの復元

### 3.3 リスト共有

リスト共有は、招待リンクまたは QR コードで実現します。

```text
設定
→ メンバーを招待
→ QRコードを表示
→ 招待されたメンバーがQRコードまたはリンクを開く
→ アカウントを登録、または登録済みアカウントでログイン
→ 共有リストへの移動と適用プランの変更を確認
→ 同じ board に参加
```

1人で利用する場合は、アカウント未登録のまま利用できます。

招待を作成するユーザーと、共有リストへ参加するユーザーは、メールアドレス / パスワードによるアカウント登録を必須とします。招待参加時は、招待した側のメールアドレスではなく、招待を受けたユーザー自身のメールアドレスを使用することを画面上で明示します。登録はFirebase Authenticationのメール列挙保護に対応したREST `signUp`へ現在のIDトークンを渡し、現在の匿名Firebase Userへ認証情報をリンクしてuidと現在データを維持します。RESTリクエストにはApp Checkトークンを付与します。登録済みユーザーは本人の既存アカウントでログインできます。

既存のアカウント未登録共有ユーザーは直ちに利用停止せず、アカウント登録を案内します。新しい招待の作成・参加から必須化します。

### 3.4 QRコード招待

QRコードは、招待リンクを画像化したものとして扱います。

内部的には招待リンクと同じ `inviteId` を使います。

```text
https://stocky-33317.web.app/invite/{inviteId}
```

インストール済み端末では iOS Universal Links / Android App Links でStocky Homeを開きます。未インストール時はFirebase Hostingの案内ページでApp Store / Google Playへ誘導し、インストール後に同じ招待リンクをもう一度開いてもらいます。Deferred Deep Linkによる`inviteId`の自動引継ぎは行いません。第三者アプリに招待IDを奪われる可能性があるカスタムURLスキームは使用しません。

MVP では以下を実装します。

- QRコード表示
- 招待URLの文字列は画面に表示せず、コピーも提供しない
- App Store / Google Playを開くボタンを表示
- 未インストール時は案内ページからStocky Homeをインストールし、インストール後に同じQRコードまたは招待リンクをもう一度開くことを表示
- 読み取り後に、招待を受けたユーザー自身のメールアドレスでアカウント登録またはログインを行う。同名のその他のメンバーがある場合だけ、引き継いで参加するか確認する
- QRコード画面に、参加中は共有リストのプランが適用され、退出後は元のリストのプランへ戻ることを表示
- 参加時に元のリストIDを`users/{uid}.previousBoardId`へ保存する
- 参加確認画面には、参加せずに在庫・買い物リストへ戻るボタンを表示する
- 参加確定前に、共有リストへ移動すること、設定から退出して元のリストへ戻れること、参加中と退出後で適用プランが変わることを確認する
- 共有リストからの退出時は、共有リストのメンバー権限を外して`previousBoardId`へ戻し、同フィールドを削除する
- 退出者がStocky Plus購入者の場合は、RevenueCat由来の購入者情報を共有リストから元のリストへ移す。購入者でない場合は、共有リスト由来のStocky Plus利用を終了して元のリストのプランを適用する

OS共有シートはMVPでは使いません。送信手段はユーザーが任意に選び、Stockyはリンクコピーまでを提供します。

招待コード手入力は MVP では実装しません。  
理由は、短いコードは総当たりリスクがあり、試行回数制限など追加設計が必要になるためです。

### 3.5 メンバーと Firebase ユーザーの違い

Stocky では、以下を分けて扱います。

| 概念 | 役割 |
|---|---|
| Firebase User | 端末・認証・アクセス権管理 |
| アプリ利用者 | Firebase Userとプロフィールに紐付く担当者表示 |
| その他のメンバー | アプリを使わない人やペットの担当者表示 |

例:

- Firebase User: `uid_xxx`
- アプリ利用者: プロフィールを登録した本人
- その他のメンバー: アプリを使わない人、ペット

アイテムの担当者は、アプリ利用者とその他のメンバーのどちらからも自由に選択できます。

アプリ利用者はプロフィール登録時に自動作成し、名前・画像は本人のプロフィールからのみ変更します。設定画面には本人紐付けを変更する項目を置きません。招待参加時は、プロフィール名と同じその他のメンバーがある場合だけ、既存メンバーとして参加するか確認します。「はい」の場合は同じメンバーをアプリ利用者へ変換し、担当アイテムを維持します。「いいえ」の場合はプロフィール名の変更を案内します。該当がなければ現在のプロフィールでアプリ利用者を追加します。

その他のメンバーはメンバー画面から追加・編集・削除できます。同一の在庫・買い物リスト内では、アプリ利用者とその他のメンバーを通じて同じ名前を登録しません。共有リストから退出したアプリ利用者はその他のメンバーへ変更し、既存のアイテム担当者設定を維持します。

無料プランのメンバー3人上限は、アプリ利用者とその他のメンバーの合計で判定します。招待参加時に既存のその他のメンバーを引き継ぐ場合は、そのメンバーをアプリ利用者へ変換するため人数は増えません。

## 4. セキュリティ基本方針

Stocky は MVP 段階からセキュリティを前提に設計します。

クライアントから Firestore に直接アクセスするため、フロントエンド上の表示制御をアクセス制御とは見なしません。  
実際のアクセス制御は Firestore Security Rules で行います。

### 4.1 セキュリティ方針

- 本番環境で Firestore test mode を使用しない
- すべての read / write は `request.auth != null` を必須にする
- `boardId` を知っているだけではデータを読めない設計にする
- `boards/{boardId}` 配下の `items` / `members` は、その board のメンバーだけが read できる。件数上限に関係する作成・削除はApp Check必須のCallable Functionsで行う
- `users/{uid}` は本人だけが read / write できる
- 招待リンクは十分長いランダム ID を使う
- 招待リンクには7日以内の有効期限を設定し、個別取得だけを許可して一覧取得を拒否する
- QRコードは招待リンクと同じ有効期限・権限制御を適用する
- 個人情報・機微情報を Firestore に保存しない
- アフィリエイト・外部 EC リンクは実装しない
- Firebase App Check を導入する
- 新規登録のパスワードは8文字以上で、英大文字・英小文字・数字をそれぞれ含める。アプリの事前検証とFirebase Authenticationの要求モードを一致させる
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
- Cloud Functions は、RevenueCatの課金状態同期、共有退出、プロフィール・アプリ利用者の同期、無料プラン上限を伴うアイテム・その他のメンバーの作成と削除に限定する。Callable FunctionsはFirebase AuthとApp Checkを必須にする
- フロントエンドの条件分岐をセキュリティ境界と見なさない

## 5. 課金・マネタイズ方針

### 5.1 基本方針

Stocky は、アフィリエイトではなく、アプリ内課金を中心にマネタイズします。

理由:

- モバイルアプリではアプリ内課金の方がユーザー体験と整合しやすい
- アフィリエイト導線は外部リンク・規約確認・計測・プライバシー対応が増える
- 買い物中に広告や外部ECリンクを出すと、Stockyの「すぐ使える」体験を壊しやすい
- MVPではコア体験の継続率確認を優先する

### 5.2 無料プラン

無料プランの制限は以下です。

```text
無料プラン
- 1リストのみ
- アイテム50件まで
- メンバー3人まで
- リスト共有あり
- サンプルデータ利用可
```

補足:

- サンプルデータは35件のため、無料上限50件でもサンプル投入後に追加余地を確保できる
- リスト共有はStockyの本質なので無料プランにも残す
- リストは無料プラン・Stocky Plusともに1リストのみ

### 5.3 Stocky Plus

Stocky Plus は月額サブスクリプションを新規購入の基本プランとします。年額サブスクリプションは既存契約の継続・復元のため保持しますが、公開時の新規購入画面には表示しません。

```text
Stocky Plus
- 1リストのみ
- アイテム無制限
- メンバー無制限
```

メンバー無制限には、アプリ利用者とその他のメンバーの両方を含みます。Stocky Plus画面にも対象範囲を明記します。

### 5.4 価格方針

初期価格の目安:

```text
月額: 200円
年額: 1,800円（既存契約の継続・復元用。新規購入画面には表示しない）
```

価格はストア審査・運用費・競合状況を見て調整します。

理由:

- Firebase / Firestore を使う共有アプリのため、運用費が継続的に発生する
- 月額200円は家庭内ツールとして導入しやすい価格に抑える
- 公開前は年額を新規購入画面から外し、月額ユーザーの継続率・解約理由・有料転換率を確認してから再表示を判断する
- 既存の年額契約は商品設定・権利・購入復元を維持し、契約者に不利益が出ないようにする

### 5.5 実装上の注意

- Stocky Plus 状態は RevenueCat のサブスクリプション entitlement で管理する
- RevenueCat の App User ID には Firebase Auth の `uid` を使う
- Stocky Plusの新規購入・購入復元・プラン変更にはアカウント登録またはログインを必須とする
- 既存のアカウント未登録Stocky Plus購入者の権利は停止せず、登録完了まで新たなプラン変更を制限する
- Stockyは1リスト運用のため、Stocky Plus購入状態はリスト単位で適用する
- リスト内のいずれかのログインユーザーがStocky Plusを購入または復元した場合、その唯一のリストに対してアイテム数・メンバー数の上限解除を反映する
- 購入復元自体は購入したFirebaseユーザーで行い、復元後に参加中のリストへStocky Plus状態を反映する
- 購入復元導線を Settings に置く
- Firestore に保存する Stocky Plus 状態はクライアントから直接更新せず、RevenueCat Webhook / Firebase Extension / Cloud Functions などのサーバー側同期で反映する
- MVP でも課金機能を導入する
- RevenueCatの年額商品は削除せず、Offeringから取得できる状態を維持する。ただし、アプリの新規購入候補には月額商品のみを表示する
- 既存の年額契約は現在プランとして表示し、購入復元とストアの契約管理導線を利用できるようにする

## 6. Firestore データ構造

### 6.1 users/{uid}

```ts
type User = {
  uid: string
  email?: string
  profile?: {
    displayName: string
    avatarKey: string
    avatarPath: string
    avatarBackgroundColor: number
    updatedAt: Timestamp
  }
  createdAt: Timestamp
  lastLoginAt: Timestamp
  currentBoardId?: string
  previousBoardId?: string // 共有リスト参加中のみ、退出時の復帰先
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
  memberType: "user" | "managed"
  linkedUserUid?: string // memberTypeがuserの場合のFirebase User
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

Stocky Plusの場合:

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
- メンバーアバターの表示位置
- 追加モーダル
- 担当者選択モーダル
- Settings / メンバー画面

Flutter 実装では、モバイル操作に最適化して再構成します。

## 9. MVP 方針

### 9.1 やること

- Flutter モバイルアプリとして実装する
- Firebase匿名ログインで即利用できる
- メール / パスワードによるアカウント保護ができる
- アカウント登録後、QRコード / 招待リンクで招待されたメンバーが同じ board に参加できる
- Firestore で複数端末同期できる
- 1リストのみ扱う
- 無料プランはアイテム50件 / メンバー3人まで
- Stocky Plusはアイテム無制限 / メンバー無制限
- 「買うもの」「あるもの」の 2 状態だけを扱う
- タップで状態を切り替える
- 長押しで編集する
- 編集シート内から削除する
- メンバーアバターは丸型プリセット画像から選択できる
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
- Cloud Functions（RevenueCat の課金状態を board 単位へ同期する用途を除く）
- drift
- SQLite 独自同期
- アフィリエイト導線
- 外部 EC サイトへの購入リンク
- プッシュ通知
- 広告 SDK
- アナリティクス SDK
- 複数リスト
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

無料プランの上限に近づいた場合は、追加画面またはアイテム追加ボタン付近で控えめに表示します。

```text
無料プランでは50件まで登録できます
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

無料プランで50件に達している場合:

- 追加ボタンを無効化
- Stocky Plus案内を表示

### 10.3 担当者選択モーダル

表示内容:

- 登録済みメンバーの丸型アバター
- 担当なし
- キャンセル
- 決定

無料プランでメンバー3人に達している場合:

- メンバー追加ボタンを無効化
- Stocky Plus案内を表示

### 10.4 Settings 画面

項目:

- アカウント
  - アカウント未登録 / 登録済みを表示
  - 新規登録と既存アカウントへのログインを分離
  - パスワード再設定
- メンバーを招待
- QRコードを表示
  - 招待URLの文字列は画面に表示しない
  - 招待リンクのコピーは提供しない
  - App Store / Google Playを開くボタンを表示する
- メンバー
  - アプリ利用者を確認する
  - アプリ利用者のプロフィールは本人だけが変更できることを表示する
  - 本人のカードはタップでプロフィール画面を開き、他の利用者は変更不可とする
  - その他のメンバーを追加・編集・削除する
- Stocky Plus
  - RevenueCat Offering から月額プランを新規購入候補として表示する
  - 年額商品は既存契約の継続・復元のため保持するが、新規購入候補には表示しない
  - 既存の年額契約者には現在プランとして年額を表示し、購入復元と契約管理を利用できるようにする
  - 月額カードのタップではプラン選択だけを行う
  - アカウント未登録でも料金と特典は閲覧可能
  - 購入・復元・プラン変更前にアカウント設定を必須とする
  - 選択中プランをラジオボタンで示す
  - 選択後、独立した購入ボタンから購入する
  - 購入を復元
  - 契約内容の確認・解約
  - 現在のプランを`Stocky Plus/月額`または`Stocky Plus/年額`で表示
  - 購入済みの商品と有効期限を表示
  - 月額 / 年額の変更予約中は、現在の商品を購入済みとして維持し、変更先を`変更予約中・次回更新から適用`と表示
  - 設定画面では変更予約を`Stocky Plus/月額（次回更新から年額）`の形式で表示
  - 変更予約中の商品は再購入できないようにする
  - 解約後は有効期限と自動更新停止済みであることを表示
  - 月額と年額はいずれも自動更新であることを表示
  - 購入者ではないメンバーには、メンバーの契約でStocky Plusを利用中とだけ表示し、契約詳細と管理操作を表示しない
  - メンバー無制限には、アプリ利用者とその他のメンバーの両方が含まれることを表示する
- サンプルデータの追加
- サンプルデータの削除
- データ初期化
  - 現在のアイテムをすべて削除する
  - 初期化後にサンプルデータ35件を追加するか選択できる
- アプリ情報

### 10.5 初回サンプルデータ選択画面

表示内容:

```text
サンプルデータを追加しますか？
Stockyをすぐ使えるように、35件のサンプルデータを追加できます。後から設定画面でも追加・削除できます。
```

選択肢:

- 35件を追加して始める
- 追加せずに始める

挙動:

- はい: 初期サンプルデータを現在の board の Firestore に登録する
- いいえ: 空の状態で開始する
- 一度選択したら board に `sampleDecisionMade = true` を保存する
- 保存済みリストへログインした場合は表示しない

## 11. 操作仕様

### 11.1 タップ操作

アイテムカードをタップすると状態を切り替えます。

星を含むアイテム画像の56x56領域をお気に入り操作のタップ対象とし、画像部分の操作では状態を切り替えません。

```text
stock -> shopping
shopping -> stock
```

確認ダイアログは出しません。

### 11.2 長押し操作

アイテムカードを長押しすると編集シートを表示します。

長押し時にカードとメニューが重なって操作しづらくなることを避けるため、MVP ではコンテキストメニューを使いません。

削除は編集シート内の削除ボタン、またはスワイプ操作から行います。
担当者設定はカード右端のメンバーアバターから行います。

アフィリエイト / 外部EC導線は実装しません。

### 11.3 担当者アバター操作

アイテムカード右端のメンバーアバターをタップすると、担当者選択モーダルを表示します。

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

### 12.3 メンバーアバター

メンバーアバターは丸型プリセットからユーザーが選択できる形式にします。
共有データとしてFirestoreに保存するアバター画像パスは、`assets/images/avatar` 配下のプリセット画像のみとします。
端末内から選択した画像は別端末へ共有できないため、保存時に担当者なし画像へ置き換えます。

画像格納例:

```text
assets/images/avatar/001.png
assets/images/avatar/002.png
...
assets/images/avatar/035.png
assets/images/avatar/999.png
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

Stocky Plusでもテーマカラー変更は提供しません。

ユーザー向けの説明文は、「管理」「適用」「必要です」のような事務的な表現を避け、「できます」「戻ります」「そのまま残ります」など、操作後の結果が具体的に伝わる柔らかい言葉を使います。削除、初期化、共有退出など取り消せない操作では、失われる内容やプランの変更を明記します。

## 14. サンプルデータ

サンプルデータは JSON asset として管理します。

```text
assets/stocky_sample_data_35_items.json
```

現在のサンプルデータは35件です。

無料プランの上限は50件なので、サンプル投入後も追加余地を確保します。

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

### 17.1 実装ルール

ルールの正本はリポジトリ直下の`firestore.rules`とし、ドキュメント内に簡略化した許可コードを複製しません。実装では次を必須とします。

- boardはUUID v4を使い、作成者本人だけを最初の所有者・メンバーとして作成する
- boardの所有者・メンバー配列・Plus状態を通常のクライアント更新から保護する
- itemsとmanaged membersの作成・削除はCallable Functionsだけに許可し、無料プランの50件・3人上限をサーバーで判定する
- app user memberとプロフィールの同期はCallable Functionsだけに許可する
- usersのメール・匿名状態はFirebase Authトークンと一致させ、currentBoardIdは本人が所属するboardだけを許可する
- inviteはUUID v4・7日以内・作成者本人に限定し、個別取得は許可するが一覧取得は拒否する
- クライアントからのboard削除を拒否し、個人boardの初期化はCallable Functionsで子データを含めて処理する

### 17.2 Rules テスト要件

Firebase Emulator Suite を使い、最低限以下をテストします。

- 未ログインユーザーは何も読めない
- ログイン済みでも他人の board は読めない
- board member は自分の board の items を読める
- board member は自分の board の items を更新できる
- board member でないユーザーは items を読めない
- users/{uid} は本人だけ読める
- 期限切れ invite は状態表示のため個別取得できるが、一覧取得はできない
- inviteId を知っていても期限切れなら参加できない
- クライアントからitems / managed membersを直接作成・削除できない
- usersのcurrentBoardIdを未所属boardへ変更できない
- 所有者を含め、クライアントからboardを削除できない

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
- 1リストのみ実装する
- 無料プランはアイテム50件 / メンバー3人まで
- Stocky Plusは月額200円 / 年額1,800円のサブスクリプションで、アイテム無制限 / メンバー無制限
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
  purchases_flutter: ^10.0.0
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

2026-07-26 時点で、Androidアプリのdebugビルド、正式署名したRelease AAB生成、Google Play月額 / 年額商品、RevenueCatのAndroid App / Entitlement / Offering設定、Google Developer Notifications接続とテスト通知送信まで完了している。内部テスト`version: 1.0.0+4`で定期購入・解約・自動更新・購入復元・期限切れを確認済み。

実ファイルと検証結果に基づいて完了状態を更新する。現在の残作業は各Phaseの未チェック項目とREADMEの「優先する残作業」を正とする。

```md
# Stocky Flutter + Firebase 実装タスクリスト

## Phase 0: 初期セットアップ
- [x] Flutter プロジェクトを作成する
- [x] Riverpod を導入する
- [x] Firebase Core を導入する
- [x] Firebase Auth を導入する
- [x] Cloud Firestore を導入する
- [x] Firebase App Check をコードへ導入する
- [x] Hive を導入する
- [x] go_router を導入する
- [x] qr_flutter を導入する
- [x] purchases_flutter を導入する
- [x] build_runner 系を使わない構成とする
- [x] assets/images を pubspec.yaml に登録する
- [x] assets/stocky_sample_data_35_items.json を pubspec.yaml に登録する

## Phase 1: アセット
- [x] assets/images/design_mock.png を配置する
- [x] assets/images/default/*.png を配置する
- [x] assets/images/food/*.png を配置する
- [x] assets/images/daily/*.png を配置する
- [x] assets/images/baby/*.png を配置する
- [x] assets/images/medical/*.png を配置する
- [x] assets/images/pet/*.png を配置する
- [x] assets/images/other/*.png を配置する
- [x] assets/images/avatar/*.png を配置する
- [x] assets/stocky_sample_data_35_items.json を配置する

## Phase 2: Firebase / セキュリティ
- [x] Firebase プロジェクトを作成する
- [x] FlutterFire CLI で Firebase 設定を生成する
- [x] 匿名ログインを有効化する
- [x] メール / パスワードログインを有効化する
- [x] Firestore を作成する
- [x] Firestore Security Rules を作成する
- [x] Firebase Emulator Suite を導入する
- [x] Security Rules テストを作成する
- [x] Firebase ConsoleでApp Check本番プロバイダを設定し、Cloud Firestore / Firebase Authentication enforcementを有効化する
- [x] Firebase Authenticationのメール列挙保護を有効化し、App Check付きREST `signUp`による匿名アカウント登録を確認する
- [x] 本番環境で test mode になっていないことを確認する
- [x] Firebase自動作成APIキーをiOS bundle ID、Android package name・署名SHA-1、Firebase HostingのHTTPリファラーで制限し、利用可能APIも限定する
- [x] Cloud Billingに月額500円、50%・90%・100%の実額しきい値とメール通知を設定する

## Phase 3: デザイン基盤
- [x] AppColors を定義する
- [x] AppTheme内でテキストスタイルを定義する
- [x] AppTheme を定義する
- [x] Material標準のCard / Button / Chip / BottomSheetをThemeで統一する
- [x] design_mock.png に合わせて余白・角丸・影を調整する

## Phase 4: 型 / Repository
- [x] UserProfile model を作る
- [x] Board model を作る
- [x] StockItem model を作る
- [x] FamilyMember model を作る
- [x] Invite model を作る
- [x] PlusSubscriptionDetailsと表示用プランモデルを作る
- [x] AuthRepository を作る
- [x] BoardRepository を作る
- [x] ItemRepository を作る
- [x] MemberRepository を作る
- [x] InviteRepository を作る
- [x] SampleDataRepository を作る
- [x] RevenueCatService を購入処理の窓口として使う
- [x] LocalSettings をローカル設定の窓口として使う

## Phase 5: Riverpod
- [x] Firebase Auth Providerを作る
- [x] Firestore Providerを作る
- [x] Hive / LocalSettings Providerを作る
- [x] repository providers を作る
- [x] 認証状態Providerを作る
- [x] リスト状態Providerを作る
- [x] inventory providers を作る
- [x] member providers を作る
- [x] invite providers を作る
- [x] Stocky Plus providers を作る
- [x] settings providers を作る

## Phase 6: 認証 / リスト初期化
- [x] 初回起動時に匿名ログインする
- [x] users/{uid} を作成する
- [x] 初回 board を作成する
- [x] board.memberUids に uid を追加する
- [x] currentBoardId を Hive に保存する
- [x] メール / パスワード昇格処理を作る

## Phase 7: サンプルデータ
- [x] JSON asset を読み込む処理を作る
- [x] categories を扱う定義を作る
- [x] items を Firestore に投入する
- [x] 初回の空のboardでサンプルデータを登録するか選択できるようにする
- [x] sampleDecisionMade を board に保存する
- [x] sampleImported を board に保存する
- [x] 重複投入を防ぐ

## Phase 8: Inventory UI
- [x] InventoryPage を作る
- [x] 買うもの / あるものタブを作る
- [x] ItemCard を作る
- [x] Firestore Stream で items を購読する
- [x] status ごとに表示を分ける
- [x] タップで status を切り替える
- [x] 長押しで編集シートを開く
- [x] 担当者アバターを表示する
- [x] 無料プラン50件上限を表示・制御する

## Phase 9: アイテム追加 / 編集 / 削除
- [x] AddItemBottomSheet を作る
- [x] アイテム名入力を作る
- [x] CategoryPicker を作る
- [x] IconPicker を作る
- [x] 初期状態選択を作る
- [x] 担当者選択を作る
- [x] アイテム追加処理を作る
- [x] アイテム編集処理を作る
- [x] アイテム削除処理を作る
- [x] 削除後のUndoは実装しない
- [x] 無料プラン50件上限到達時にStocky Plus案内を出す
- [x] Amazon / 楽天 / 外部 EC リンクを実装していないことを確認する

## Phase 10: メンバー
- [x] MemberManagementPage を作る
- [x] アプリ利用者とその他のメンバーを分けて表示する
- [x] アプリ利用者は本人のプロフィールからのみ変更できるようにする
- [x] その他のメンバーだけ追加・編集・削除できるようにする
- [x] MemberAvatar を作る
- [x] AvatarPresetGrid を作る
- [x] メンバー追加処理を作る
- [x] メンバー編集処理を作る
- [x] メンバー削除処理を作る
- [x] 無料プラン3人上限を制御する
- [x] ItemCard から担当者選択を開けるようにする

## Phase 11: メンバー招待
- [x] inviteId を安全なランダム文字列で生成する
- [x] invites/{inviteId} を作成する
- [x] expiresAt を設定する
- [x] QRコード表示を作る
- [x] 招待URLの文字列を表示せず、リンクコピーも提供しない
- [x] App Store / Google Playを開くボタンを表示する
- [x] InviteJoinPage を作る
- [x] 招待作成・参加前のアカウント登録を必須にする
- [x] 登録 / ログイン後に開いていた招待へ自動参加する
- [x] QRコード画面に事前インストールと参加手順を表示する
- [x] 参加前に共有リストへの移動と適用プランの変更を確認する
- [x] 参加確認画面から、参加せずに在庫・買い物リストへ戻れる
- [x] 参加時に元のリストIDを保存する
- [x] 設定から共有リストを退出して元のリストへ戻る
- [x] 退出時に購入者のStocky Plus状態を元のリストへ移す
- [x] 招待リンクから board に参加する処理を作る
- [x] board.memberUids に参加者 uid を追加する
- [x] 招待参加時は、同名のその他のメンバーがある場合だけ引継ぎ確認を表示し、該当がなければ現在のプロフィールで参加する
- [x] 設定から本人紐付けの変更項目を削除する
- [x] 他ユーザーのメンバー紐付けを上書き・解除・削除できないRulesを追加する
- [x] 共有リスト退出時に本人のメンバー紐付けを解除する
- [x] 本人の紐付けに関係なくアイテム担当者を自由に変更できる状態を維持する
- [x] 期限切れ invite を拒否する
- [x] QRコード / HTTPSリンクからの直接起動時に、招待取得前の匿名認証を保証する
- [x] 期限切れ招待を専用メッセージで案内し、共有リストへの参加はRulesで拒否する
- [x] 招待リンクを HTTPS 形式へ移行する
  - Firebase Hostingの`stocky-33317.web.app`を正本にする
  - 未インストール時は App Store / Google Play へ案内する
  - インストール済みの場合は Universal Links / Android App Links でアプリを開く
  - インストール後は同じ招待リンクをもう一度開いてもらう
  - Deferred Deep LinkによるinviteIdの自動引継ぎは行わない
- [x] HTTPS招待ページとOS関連付けファイルをFirebase Hostingへ公開する
- [x] Android App Links / iOS Universal Linksから招待参加画面が開くことを確認する

## Phase 12: Stocky Plus / 課金
- [x] PlusPage を作る
- [x] 月額 / 年額の商品IDを定義する
- [x] iOS RevenueCat の entitlement / offering を設定する
- [x] purchases_flutter の購入処理を作る
- [x] 購入復元処理を作る
- [x] iOSのサブスクリプション管理画面を開く導線を作る
- [x] Stocky Plus状態Providerを作る
- [x] アプリ起動時に RevenueCat の App User ID へ Firebase Auth uid を設定する
- [x] メールアカウント切り替え後に RevenueCat の App User ID と Stocky Plus状態を再設定する
- [x] RevenueCat Webhook / Cloud Functions で board 単位の Stocky Plus 状態を Firestore に同期する
- [x] 購入者本人の Stocky Plus状態に応じてアイテム数制限を切り替える
- [x] 購入者本人の Stocky Plus状態に応じてメンバー数制限を切り替える
- [x] board 単位の Stocky Plus状態に応じて全boardメンバーの上限を切り替える
- [x] iOS Sandbox で購入と購入者本人へのStocky Plus反映を確認する
- [x] iOS Sandbox で自動更新を確認する
- [x] iOS Sandbox で期限切れとboard全体のStocky Plus解除を確認する
- [x] iOS Sandbox で購入復元とStocky Plus維持を確認する
- [x] iOS Sandbox で手動解約後も有効期限までStocky Plusが維持されることを確認する
- [x] 同じboardの別メンバーへStocky Plusが反映されることを確認する
- [x] Android の RevenueCat / Google Play 課金商品を設定する
- [x] Android の Google Developer Notificationsを接続し、テスト通知を送信する
- [x] Android の内部テストで定期購入・解約・自動更新・購入復元・期限切れを確認する

Stocky Plusの本番購入処理は RevenueCat を使って MVP で導入します。テーマカラー変更は実装対象外です。

2026-07-14時点でWebhook Function、board単位のStocky Plus集約、Flutterのboard状態購読、改ざん防止Rulesは実装・本番デプロイ済みです。RevenueCat DashboardへのWebhook登録、Testイベントの`200`応答、iOS実機のSandbox購入・復元・自動更新・手動解約・期限切れ、購入者本人と同じboardへ参加した別のAndroidユーザーへのStocky Plus反映を確認済みです。

## Phase 13: Settings
- [x] SettingsPage を作る
- [x] アカウント登録 / ログイン / パスワード再設定画面を作る
- [x] メンバー招待 UI を作る
- [x] アプリ利用者の確認とその他のメンバー管理導線を作る
- [x] Stocky Plus 導線を作る
- [x] サンプルデータ再登録を作る
- [x] データ初期化を作る
- [x] データ初期化時にサンプルデータを追加するか選べるようにする
- [x] アプリ情報画面を作る

## Phase 13.5: Stocky Plus / HTTPS 招待リンク以外の優先実装
- [x] MemberRepository を作り、boards/{boardId}/members を Firestore の正本にする
- [x] メンバー追加・編集・削除を Firestore に保存する
- [x] メンバー削除時に、該当メンバーが割り当てられた item.assignedMemberId を解除する
- [x] users/{uid} を作成し、匿名 / メール登録済み状態と最終利用 boardId を保存する
- [x] メール / パスワードの新規登録と既存アカウントログインを分離する
- [x] パスワード再設定メールの送信を実装する
- [x] users/{uid}.currentBoardId からログイン済みユーザーの board を復元する
- [x] users/{uid}.previousBoardId から共有リスト退出時の復帰先を管理する
- [x] sampleImported / sampleDecisionMade を board ドキュメントに保存する
- [x] Hive の sampleSeeded はローカル補助情報に限定する
- [x] Firebase Emulator Suite で Security Rules テストを追加する
- [x] Firebase App Check をコード初期化する
- [x] Firebase Console 側で Android App Check に Play Integrityを設定する
- [x] Firebase Console で iOS App Check に App Attest とDeviceCheck fallbackを設定する
- [x] Android / iOSの検証済み通信を確認し、Cloud Firestore / Firebase Authentication enforcementを有効化する
- [x] メール列挙保護とApp Check適用後に、匿名UIDを維持したメール / パスワード登録をAndroid統合テストで確認する

## Phase 14: テスト
- [x] Security Rules テストを作る
- [x] sortOrder のテストを作る
- [x] status 切り替えのテストを作る
- [x] sample data import のテストを作る
- [x] Board / Item / Member / UserProfile Repositoryのテストを作る
- [x] 無料プラン上限のテストを作る
- [x] Stocky Plus状態のテストを作る
- [x] アカウント画面のWidgetテストを作る
- [x] Inventoryのタップ切り替え・お気に入り・編集・削除のWidgetテストを作る
- [x] Membersのアプリ利用者・その他のメンバー管理のWidgetテストを作る
- [x] Stocky Plusの商品取得失敗・購入可否・契約状態表示のWidgetテストを作る
- [x] オンボーディングのプロフィール保存・ローディング・サンプル選択のWidgetテストを作る
- [x] データ初期化とサンプル追加選択のWidgetテストを作る

## Phase 15: ビルド
- [x] Android debug ビルド確認
- [x] Android Release署名を設定し、AAB生成と署名を確認
- [x] iOS 実機ビルド / 起動確認
- [x] アプリアイコン設定
- [x] スプラッシュ画面設定
- [x] Android の Google Play内部テストへ配布する
- [x] Android の内部テスト配布で定期購入・解約・自動更新・購入復元・期限切れを確認する
```

## 21. 完了条件

MVP 完了条件は以下です。

- Flutter モバイルアプリとして起動できる
- `assets/images/design_mock.png` に近い UI が再現されている
- 匿名ログインで即利用できる
- メール / パスワードでデータ保護できる
- QRコード / 招待リンクで招待されたメンバーが同じ board に参加できる
- 複数端末で同じ board の状態が同期される
- 1リストのみで運用できる
- 無料プランでアイテム50件まで制限できる
- 無料プランでアプリ利用者とその他のメンバーを合計3人までに制限できる
- Stocky Plusでアイテム無制限になる
- Stocky Plusでメンバー無制限になる
- 初回にサンプルデータ追加を選択できる
- データ初期化時に、サンプルデータを追加するか選択できる
- サンプルデータが Firestore に保存される
- 「買うもの」と「あるもの」を表示できる
- アイテムをタップで相互移動できる
- アイテムを追加できる
- アイテムを編集できる
- アイテムを削除できる
- 6カテゴリからカテゴリ選択できる
- カテゴリごとのアイテムアイコンを選択できる
- メンバーを丸型プリセットアバターから登録できる
- アバターの見た目を選択できる
- アイテムごとに担当者を任意設定できる
- Settings からアカウント保護・メンバー招待・アプリ利用者の確認・その他のメンバー管理・Stocky Plus・データ初期化・アプリ情報を開ける
- Firestore Security Rules が実装されている
- Firebase Emulator Suite で Rules テストがある
- Firebase App Check が設定されている
- Amazon / 楽天 / 外部 EC / アフィリエイト導線が存在しない
- iOS の実機ビルドが通る
- Android のdebugビルドが通る
- Android の内部テスト配布でRevenueCat / Google Playの定期購入・解約・自動更新・購入復元・期限切れを確認する
