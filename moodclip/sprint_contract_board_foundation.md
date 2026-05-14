# Sprint Contract: Board Foundation Reframe

## 参照する Product Brief

- `docs/product_brief_board_reframe.md`

## 対象

- 画面: 設定画面、ボード一覧画面、書き出し画面
- 機能: 用語整理、共有保存動作設定、既定レイアウトプリセット、画像ギャラリー反映
- 関連ファイル: `AGENTS.md`, `README.md`, `lib/domain/entities/*`, `lib/features/settings/*`, `lib/features/bookmarks/*`

## 実装範囲

- source of truth 文書を mixed-media board app 前提に更新する
- `shareSaveBehavior` をアプリ設定に追加し、設定画面と共有保存フローに接続する
- `defaultLayoutPreset` をアプリ設定に追加する
- ボード別のレイアウトプリセット override を追加する
- layout preset を画像ギャラリー表示と書き出し表示に反映する
- UI 文言を `カテゴリ / ブックマーク` から `ボード / クリップ` 側へ寄せる

## 非対象

- クリップ型の全面移行
- 画像、音楽、位置情報の新規共有入力対応
- 自由配置

## 受け入れ条件

- 設定画面で共有保存動作を切り替えられる
- `保存時に保存先ボードを選ぶ` を選んだ場合、共有 URL 保存前にボード選択導線が出る
- 設定画面で既定レイアウトプリセットを切り替えられる
- 設定画面でボード別レイアウトプリセットを設定・解除できる
- 画像ギャラリーと書き出し画面でプリセット差分が反映される
- README と AGENTS と foundation 文書の用語と方向性が一致している

## TDD方針

- `AppSettings.copyWith` の新規設定項目を unit test で担保する
- 画像ギャラリーのプリセット切替を widget test で最低限担保する
- 共有保存動作の UI 導線は widget レベルで分岐を確認する

## 検証コマンド

```sh
flutter analyze
flutter test
```
