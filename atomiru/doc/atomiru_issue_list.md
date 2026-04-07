# あとみる 実装タスク一覧（最終仕様ベース）

この文書は現在の実装状態を反映したタスク整理であり、初期 MVP 分解ではなく最終仕様の追跡用として扱う。仕様の正本は `doc/atomiru_requirements.md`。

## Epic 0: プロジェクト基盤

- [x] Flutter プロジェクト作成
- [x] iOS / Android 起動設定
- [x] feature 単位の `lib/features/` 構成
- [x] ルーティング
- [x] テーマ / ブランド背景
- [x] ローカライズ基盤

## Epic 1: ローカルDB

- [x] `items` テーブル
- [x] `normalized_url` による重複判定
- [x] `ItemRepository`
- [x] pending / done 取得
- [x] 一括完了 / 一括延期
- [x] 種類ごとの pending 件数取得

## Epic 2: 共有保存

- [x] Android Share Intent 受信
- [x] iOS Share Extension 連携
- [x] URL / テキスト共有の受信
- [x] ShareSave 画面
- [x] 重複保存の抑止
- [x] 保存後の Inbox 反映

## Epic 3: 分類と通知時刻

- [x] `read` / `watch` / `check` の分類
- [x] 初期デフォルト通知
  - `read`: 当日 21:00
  - `watch`: 翌日 20:00
  - `check`: 土曜日 10:00
- [x] Pro 向けの種別ごとのデフォルト通知設定
  - 当日
  - 翌日
  - 曜日を選択する
  - 時刻
- [x] デフォルト通知変更時に既存 pending カードへ反映するか確認
- [x] 対象カード 0 件時は既存カード反映確認をスキップ

## Epic 4: 通知

- [x] flutter_local_notifications 初期化
- [x] Android 通知チャンネル
- [x] 通知権限状態の確認
- [x] Android 13+ の通知権限リクエスト
- [x] Android 12 以下の通知オフ状態を system settings 誘導として扱う
- [x] 保存時の通常通知予約
- [x] 通知タップから詳細画面へ遷移
- [x] 完了 / 延期 / 種類変更時の通知キャンセル・再予約
- [x] 種類ごとの通常通知本文
- [x] Pro 向け 1 回だけ再通知
- [x] 再通知間隔
  - 1時間後
  - 3時間後
  - 6時間後
  - 12時間後
  - 24時間後

## Epic 5: Inbox / 詳細

- [x] pending 一覧
- [x] scheduled_at 昇順表示
- [x] ItemDetail 表示
- [x] URL を開く
- [x] 完了
- [x] Snooze / 延期
- [x] Pro 向け保存後の種類変更
- [x] 種類変更後の通知再計算・再予約
- [x] Pro 向け一括完了
- [x] Pro 向け一括延期
- [x] 一括完了の確認ダイアログ

## Epic 6: Settings

- [x] 言語設定
- [x] 通知権限導線
- [x] デフォルト通知設定
- [x] Pro 向け再通知設定
- [x] アプリ情報集約
- [x] 公式サイト / プライバシーポリシー / 利用規約 / 問い合わせ導線
- [x] Pro 機能一覧の整理
- [x] デバッグ情報の非表示化
- [x] オープンソースライセンス導線の非表示化

## Epic 7: 課金 / Pro

- [x] `in_app_purchase` 連携
- [x] `atomiru_pro` の商品取得
- [x] 1 回限りの購入
- [x] 復元
- [x] 起動時のストア同期
- [x] Pro 状態の UI 反映
- [x] Pro 機能のロック / Paywall 誘導

## Epic 8: 履歴 / 検索

- [x] 履歴画面
- [x] Pro 向け履歴表示
- [x] 検索実装
- [x] 検索 UI は現リリースでは feature flag で非表示

## Epic 9: ストア / リリース準備

- [x] 日本語表示名: あとみる
- [x] 英語表示名: Catch Up Later
- [x] アプリアイコン更新
- [x] 通知アイコン更新
- [x] Android 12+ スプラッシュ実機確認
- [x] Play Console default listing を英語、localized listing を日本語にする方針
- [x] Pro 商品は 1 回限りの購入として扱う方針
- [x] リリース記念価格は価格本文に固定記載しない方針

## 現リリース対象外

- [ ] クラウド同期
- [ ] AI要約
- [ ] タグ / フォルダ
- [ ] Web版
- [ ] 高度な再通知ルール
- [ ] 検索 UI の公開
