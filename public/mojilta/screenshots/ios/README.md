# iOS撮影素材

撮影日: 2026-11-03〜04（日本時間）。iPhone 17シミュレータ / iOS 26.5、Mojilta 1.0.0+3。全23枚、1206 × 2622 px、縦向きPNG。

現在のソースから通常起動用のdebugアプリをビルドし、既存データを保持して更新しました。標準Filesで別アプリ「Mojilta Fixtures」の「読みもの」フォルダに置いたオリジナル2文書を開き、実際に操作して撮影しています。文書セッション・履歴・本文の注入は行っていません。

## 画像一覧

| ファイル | 内容 | LPでの用途 |
|---|---|---|
| [00-home-empty.png](00-home-empty.png) | ファイルを開く前の空ホーム | 初回画面の紹介 |
| [01-txt-dark.png](01-txt-dark.png) | 「雨あがりの栞.txt」、ゴシック・ダーク | TXT閲覧の主画像 |
| [02-txt-immersive.png](02-txt-immersive.png) | 操作UIを隠したTXT | 本文を中心にした紹介 |
| [03-txt-selection.png](03-txt-selection.png) | 第1段落の「駅」から第2段落末・改行まで選択 | 段落をまたぐコピー |
| [04-txt-search.png](04-txt-search.png) | 「手紙」を検索、1/3と本文ハイライト | ファイル内検索 |
| [05-markdown-rendered.png](05-markdown-rendered.png) | 「週末の小さな旅.md」、整形表示 | Markdownの主画像 |
| [06-markdown-source.png](06-markdown-source.png) | 同じ文書の閲覧専用原文 | 整形／原文の対比 |
| [07-home-history.png](07-home-history.png) | 2文書の履歴と再開カード | 実際に使っているホーム |
| [08-language-menu.png](08-language-menu.png) | ホームの言語プルダウン | 日本語・英語UIの紹介 |
| [09-settings-reading.png](09-settings-reading.png) | 本文サイズ・行間・余白と標準サンプル | 読みやすさの調整 |
| [10-display-preview.png](10-display-preview.png) | 専用の表示プレビュー | ファイル不要のプレビュー |
| [11-settings-font.png](11-settings-font.png) | 明朝を選択した設定画面 | 字体の選択 |
| [12-settings-appearance.png](12-settings-appearance.png) | 外観モードと6色のアクセント | テーマの紹介 |
| [13-txt-serif-dark.png](13-txt-serif-dark.png) | 明朝・ダークのTXT、文字コード表示あり | 字体の比較 |
| [14-txt-serif-light.png](14-txt-serif-light.png) | 明朝・ライトのTXT、文字コード表示なし | ライト／ダークの対比 |
| [15-file-picker.png](15-file-picker.png) | 標準Filesの「読みもの」内にある2文書 | ファイルを開く手順 |
| [16-markdown-table.png](16-markdown-table.png) | Markdownの表全4行とコードブロック | Markdownの表現例 |
| [17-reader-settings-sheet.png](17-reader-settings-sheet.png) | 閲覧中の表示設定シート | 本文を開いたまま設定 |
| [18-encoding-sheet.png](18-encoding-sheet.png) | UTF-8 / Shift_JISの選択シート | 文字コード選択の説明 |
| [19-settings-about.png](19-settings-about.png) | 表示トグルとアプリ情報 | 設定画面の補助素材 |
| [20-txt-handwritten-dark.png](20-txt-handwritten-dark.png) | 手書き風・18sp・広い余白のTXT | 同梱字体の比較 |
| [21-txt-large.png](21-txt-large.png) | ゴシック・24spのTXT | 大きい文字での折り返し |
| [22-settings-handwritten.png](22-settings-handwritten.png) | 手書き風と広い余白を選択した設定 | 字体と余白の操作例 |

## 撮影と確認

- UI操作はDevice Hubのシミュレータ画面を通じて実施。ネイティブPNGは `xcrun simctl io … screenshot` で保存しました。
- 再撮影用の保存補助はアプリ側リポジトリの `tool/capture_lp_ios.py`。PNG名を入力する対話セッションで、UI操作やデータの変更は行いません。
- ステータスバーは端末の実際の表示です。時刻や電池を画像編集で差し替えていません。端末フレーム・キャッチコピーの合成、本文の差し替え、トリミングもしていません。
- 全23枚を目視確認し、選択範囲・スクロール位置・文字コードシート・手書き風を撮り直しました。PNGの構造・CRC・展開データも確認しました。
- 設定画面と専用プレビューはアプリ内の標準サンプルです。ファイル閲覧画面は今回のオリジナル文書です。
- 撮影後はダーク・Dandelion・18sp・行間標準・余白標準・ゴシック・位置表示オン・文字コード表示オフ・言語システムへ戻しました。サンプルの履歴は残し、既存データは削除していません。
- エラー画面は通常利用を見せるLP素材の対象から外しています。この撮影は全受け入れテストの再実行ではありません。

原稿本文の利用説明は [samples/README.md](../samples/README.md) を参照してください。アプリのアイコン・フォント等にはそれぞれの権利・ライセンスが適用されます。

再撮影時は保存先を `--output` で明示する。移動元のアプリ側でコマンドを実行し、保存先には本フォルダを指定する。
