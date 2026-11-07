# 英語LP用の実画面

撮影日: 2026-11-08（日本時間）。アプリの言語メニューでEnglishを選び、英訳したTXT・Markdownを標準ファイル選択画面から開いて撮影しました。画像内の本文・UI・時計の差し替えや合成はしていません。

| OS | 環境 | 原寸・枚数 |
|---|---|---|
| Android | Pixel 10 AVD / Android 17（API 37.2-ext24） | 1080 × 2424 px、4枚 |
| iOS | iPhone 17シミュレータ / iOS 26.5 | 1206 × 2622 px、4枚 |

アプリは作業時点の1.0.0+4を一時ディレクトリに複製してビルドし、別のアプリID `com.mojilta.lpcapture` でインストールしました。購入状態のみ既存のテスト用ゲートウェイで「購入済み」に固定しています。閲覧・設定・履歴・ファイル選択はアプリ本体の実装で、文書セッションの注入や画面の代替実装はしていません。実取引の動作確認やストア配布版の撮影を意味しません。元の開発プロジェクトや既存アプリのデータは変更していません。

| 原寸PNG | 掲載用画像（`../../images/en/`） | 内容 |
|---|---|---|
| [Android TXT](android/05_txt_dark.png) | android-txt | After the Rain.txt、18sp、ツールバー表示 |
| [Android 設定](android/11_settings_reading.png) | settings | 英語の設定とアプリ標準プレビュー |
| [Android Markdown整形](android/02_markdown_dark.png) | android-markdown | A Small Weekend Trip.md、先頭 |
| [Android Markdown原文](android/03_markdown_source.png) | android-markdown-source | 同じ文書、閲覧専用原文、先頭 |
| [iOS TXT](ios/01-txt-dark.png) | txt | After the Rain.txt、18sp、先頭 |
| [iOS TXT拡大](ios/21-txt-large.png) | txt-large | 同じ文書、24sp、先頭 |
| [iOS 範囲選択](ios/03-txt-selection.png) | selection | 第1段落から第2段落内にまたがる選択と英語Copyメニュー |
| [iOS 履歴](ios/07-home-history.png) | history | 英語ファイル2件とResume viewingカード |

ダーク外観、Dandelion、Sans、標準の行間・左右余白で撮影。iOSの文字サイズ比較だけ24spに変更し、撮影後18spへ戻しました。18sp・24spは静止画の比較であり、ピンチ操作の動画ではありません。Markdownのブロック横断選択には原文表示を使います。

掲載用画像は原寸PNGから幅360px・720pxのJPEG（品質93）を生成し、切り抜きはしていません。原寸とハッシュは [manifest.json](manifest.json) に記録しています。

## 文書

- [After the Rain.txt](samples/After%20the%20Rain.txt)
- [A Small Weekend Trip.md](samples/A%20Small%20Weekend%20Trip.md)

既存の日本語撮影サンプルを英訳した架空の短編・散歩メモです。元の日本語と同様、LP・ストア素材等に再利用・改変でき、出典表記は不要です。既存の日本語文書は保持しています。
