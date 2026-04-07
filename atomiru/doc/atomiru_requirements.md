# あとみる 要件定義書（最終仕様）

この文書は現在の実装仕様を正とする。過去の MVP 案と差分がある場合は、この文書を優先する。

## プロジェクト名

- 日本語表示名: あとみる
- 英語表示名: Catch Up Later
- 内部識別子 / 商品 ID: `atomiru`, `atomiru_pro`

## コンセプト

あとで読みたい・見たい・確認したいリンクを、共有からすばやく保存し、指定したタイミングで通知する iOS / Android 向けアプリ。

コア UX:

- 保存時の判断を最小化する
- Share -> 保存の操作を短くする
- 保存したリンクを通知で思い出せるようにする

## 対応プラットフォーム

- iOS
- Android

## 技術スタック

- Flutter / Dart
- Riverpod
- sqflite
- flutter_local_notifications
- receive_sharing_intent
- in_app_purchase
- shared_preferences

## 主要機能

### 共有から保存

他アプリから URL またはテキストを共有し、ShareSave 画面で保存する。

想定共有元:

- ブラウザ
- YouTube
- SNS
- ニュースアプリ
- テキスト共有

### 自動分類

保存対象を `kind` として分類する。

- `read`: 記事 / 読むもの
- `watch`: 動画 / 見るもの
- `check`: 商品 / その他 / 確認するもの

判定例:

- YouTube -> `watch`
- Web 記事 -> `read`
- その他のリンク / テキスト -> `check`

### デフォルト通知

無料版では保存時に自動で通知時刻を決定する。

| 種別 | 初期デフォルト |
| --- | --- |
| `read` | 当日 21:00 |
| `watch` | 翌日 20:00 |
| `check` | 土曜日 10:00 |

Pro 版では、種別ごとにデフォルト通知設定を変更できる。

- タイミング: 当日 / 翌日 / 曜日を選択する
- 曜日: 月曜日 / 火曜日 / 水曜日 / 木曜日 / 金曜日 / 土曜日 / 日曜日
- 時刻: 任意の時刻
- 変更時に、既存の同じ種類の pending カードにも反映するかユーザーが選択できる
- 既存対象カードがない場合は、反映確認ダイアログを表示しない

### 通知

通常通知の本文は種別ごとに分ける。

日本語:

- `read`: 保存した記事を読む時間です
- `watch`: 保存した動画を見る時間です
- `check`: 保存したリンクをチェックする時間です
- fallback: 保存したリンクを確認する時間です

英語:

- `read`: You have an article scheduled to read tonight
- `watch`: You have a video scheduled to watch
- `check`: You have a link scheduled to check
- fallback: You have a link to check later

通知タップ時は対象 Item の詳細画面へ遷移する。

### 再通知

Pro 版では 1 回だけ再通知できる。

- 再通知は通常通知の指定時間後に 1 回だけ送る
- 選択肢: 1時間後 / 3時間後 / 6時間後 / 12時間後 / 24時間後
- 内部保存値は分単位の `reNotifyDelayMinutes`
- 再通知本文は種別共通

日本語:

- 保存したリンクをもう一度確認しませんか？

英語:

- You still have a saved link waiting for you

### Snooze / 延期

Item 詳細または一括延期から通知予定を変更できる。

主な選択肢:

- 1時間後
- 今夜
- 明日
- 週末
- 必要に応じた時刻選択

### 完了 / 履歴

- `pending` から `done` へ変更できる
- 完了した Item は履歴で確認できる
- 履歴は Pro 機能

### 一括操作

Pro 版では Inbox の選択モードで以下を実行できる。

- 一括完了
- 一括延期

一括完了は実行前に確認ダイアログを表示する。

### 保存後の種類変更

Pro 版では保存後の Item 詳細画面で種類を変更できる。

- `read`
- `watch`
- `check`

種類変更後は現在のデフォルト通知設定に基づいて通知時刻を再計算し、通知を再予約する。

### 検索

検索実装は保持しているが、現在のリリースでは UI から非表示にする。再公開時は `lib/core/config/constants.dart` の `kSearchFeatureVisible` を起点に戻す。

## 保存データ

`items` テーブル:

- `id`
- `url`
- `normalized_url`
- `title`
- `kind`
- `status`
- `scheduled_at`
- `created_at`
- `updated_at`

`kind`:

- `read`
- `watch`
- `check`

`status`:

- `pending`
- `done`

## 画面一覧

- Inbox
- ItemDetail
- ShareSave
- Settings
- Paywall
- History
- Search（実装保持、現リリースでは UI 非表示）
- Onboarding
- About

## 無料版

無料版で利用できる機能:

- 共有から保存
- 自動分類
- 自動デフォルト通知
- 通知
- Snooze / 延期
- 完了
- Inbox 一覧
- Item 詳細
- 通知権限導線
- 言語設定
- アプリ情報 / サポート / プライバシーポリシー / 利用規約への導線

## Pro版

Pro は `atomiru_pro` の 1 回限りのアプリ内購入として扱う。

Pro 機能:

- 種別ごとのデフォルト通知設定
- 1 回だけ再通知
- 保存後の種類変更
- 履歴
- 一括完了
- 一括延期

現リリースで UI 非表示の Pro 関連実装:

- 検索

## 言語 / 表示名

- アプリ内言語設定: システムデフォルト / 日本語 / 英語
- 日本語アプリ名: あとみる
- 英語アプリ名: Catch Up Later
- Play Console / App Store Connect の default listing は英語、localized listing に日本語を追加する方針

## 非スコープ

以下は現リリースの対象外。

- AI要約
- クラウド同期
- Web版
- タグ
- フォルダ
- 高度な再通知ルール
- 検索 UI の公開
