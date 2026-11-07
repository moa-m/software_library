# Android撮影素材

撮影日: 2026-11-04（日本時間）。Pixel 9 AVD / Android 17（API 37）、Mojilta 1.0.0+2（実端末のパッケージ情報で確認）。全23枚、1080 × 2424 px、縦向きPNG。

起動済みエミュレータをデータ保持で再起動し、Android StudioのRunning Devicesから実画面を操作しました。標準SAFでDownloadに置いたオリジナル2文書を選択しています。文書セッション・履歴・本文の注入は行っていません。現在の `pubspec.yaml` のビルド番号3とは区別し、撮影済みの実ビルド番号を記録しています。

## 画像一覧

| ファイル | 内容 | LPでの用途 |
|---|---|---|
| [00_home_empty.png](00_home_empty.png) | ファイルを開く前の空ホーム | 初回画面の紹介 |
| [01_markdown_immersive.png](01_markdown_immersive.png) | Markdown整形表示、操作UI非表示 | 本文を中心にした紹介 |
| [02_markdown_dark.png](02_markdown_dark.png) | 「週末の小さな旅.md」の整形表示 | Markdownの主画像 |
| [03_markdown_source.png](03_markdown_source.png) | 同じ文書の閲覧専用原文 | 整形／原文の対比 |
| [04_file_picker.png](04_file_picker.png) | 標準SAFの「ダウンロード → 読みもの」、2文書だけの一覧 | ファイルを開く手順 |
| [05_txt_dark.png](05_txt_dark.png) | 「雨あがりの栞.txt」、ゴシック・ダーク | TXT閲覧の主画像 |
| [06_txt_immersive.png](06_txt_immersive.png) | 操作UIを隠したTXT | 本文を中心にした紹介 |
| [07_txt_selection.png](07_txt_selection.png) | 標準の「すべてを選択」で複数段落を含む本文を選択 | 文書全体を選んだ状態。ハンドル調整の実演画像とは区別。 |
| [08_txt_search.png](08_txt_search.png) | 「手紙」を検索、1/3と本文ハイライト | ファイル内検索 |
| [09_home_history.png](09_home_history.png) | 2文書の履歴と再開カード | 実際に使っているホーム |
| [10_language_menu.png](10_language_menu.png) | ホームの言語プルダウン | 日本語・英語UIの紹介 |
| [11_settings_reading.png](11_settings_reading.png) | 本文サイズ・行間・余白・字体と標準サンプル | 読みやすさの調整 |
| [12_display_preview.png](12_display_preview.png) | 専用の表示プレビュー | ファイル不要のプレビュー |
| [13_settings_font_serif.png](13_settings_font_serif.png) | 明朝を選択した設定画面 | 字体の選択 |
| [14_settings_appearance.png](14_settings_appearance.png) | 外観モードと6色のアクセント | テーマの紹介 |
| [15_home_light.png](15_home_light.png) | ライト表示の履歴付きホーム | ホームのライト／ダーク比較 |
| [16_txt_serif_light.png](16_txt_serif_light.png) | 明朝・ライトのTXT | 字体と外観の比較 |
| [17_reader_settings_sheet.png](17_reader_settings_sheet.png) | 閲覧中の表示設定シート、ライト | 本文を開いたまま設定 |
| [18_settings_about.png](18_settings_about.png) | 表示トグルとアプリ情報 | 設定画面の補助素材 |
| [19_txt_handwritten_dark.png](19_txt_handwritten_dark.png) | 手書き風・18sp・標準余白のTXT | 同梱字体の比較 |
| [20_encoding_sheet.png](20_encoding_sheet.png) | UTF-8 / Shift_JISの選択シート | 文字コード選択の説明 |
| [21_txt_large.png](21_txt_large.png) | ゴシック・24spのTXT | 大きい文字での折り返し |
| [22_markdown_table.png](22_markdown_table.png) | Markdownの表全4行とコードブロック | Markdownの表現例 |

## 撮影と確認

- UI操作はAndroid StudioのRunning Devices内で実施。PNGは `adb exec-out screencap -p` によるネイティブ出力です。
- 再撮影用の保存補助はアプリ側リポジトリの `tool/capture_lp_android.py`。UI操作・画像合成・本文の差し替えは行いません。
- 時計・電池等は端末の表示のままです。画像編集・トリミング・端末フレームの追加はしていません。
- 設定画面と専用プレビューはアプリ内の標準サンプル、閲覧画面は今回のオリジナル文書です。
- 撮影後はダーク・Dandelion・18sp・行間標準・余白標準・ゴシック・位置表示オン・文字コード表示オフへ戻しました。言語設定は変更していません。サンプル履歴は残し、既存データは削除していません。
- 端末の原稿2件のSHA-256はリポジトリのサンプルと一致し、閲覧・選択・検索の前後で元の本文が変わっていないことを確認しました。
- 全23枚を目視確認し、ファイル選択画面をサンプル専用フォルダで撮り直しました。PNGの構造・CRC・展開データも確認しました。
- エラー画面は通常利用を見せるLP素材に含めていません。この撮影は全受け入れテストの再実行ではありません。

原稿本文の利用説明は [samples/README.md](../samples/README.md) を参照してください。アプリのアイコン・フォント等にはそれぞれの権利・ライセンスが適用されます。

再撮影時は保存先を `--output` で明示する。移動元のアプリ側でコマンドを実行し、保存先には本フォルダを指定する。
