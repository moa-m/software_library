> アプリ側仕様の2026-11-04時点の写し。本文中の開発用パスはアプリ側リポジトリ基準。LP用画像は本パッケージの `branding/` と `screenshots/` を使う。

# 08_ICON_SPEC — Mojilta App Icon

## 採用アイコン

ユーザー提供の **濃紺背景・クリーム色のMと金色の本** を採用する。
透過PNGの原本は `docs/reference/assets/app_icon_cream_book_source.png`。
提供元は「クリーム色のMと金色の本アイコン.png」。旧アイコンの資産は履歴用の参考であり、現在のランチャーには使わない。

## 造形と色

- 提供画像のクリーム色のM、金色のページ、濃紺背景と質感を維持する。描き直し・別案の生成は行わない。
- 画像外周の透明余白を除いて配置し、小さなサイズでもMと本を識別できるようにする。
- アプリ内の外観・テーマカラーの変更ではランチャーアイコンを変えない。

## プラットフォーム資産

`swift tool/generate_app_icons.swift` で同じ原本から生成する。

- Android 26以降: 108 dpの前景・背景レイヤー。前景の中央72 dpへ絵柄を配置し、外周を色で延長してマスクと動きの余地を確保する。角丸を重ねず、端末のマスクへ合わせる。
- Android 33以降: 原本の明るいMと本をアルファへ変換したモノクロレイヤーも作る。
- Android 24–25: mdpi〜xxxhdpiの通常／round PNG。原本の角丸と透過を保持する。
- iOS: AppIconカタログの全サイズをRGBで生成する。透明な角のみ近傍から採った背景色で補い、正方形・不透明の画像をOSのマスクへ渡す。
- 原本は変更せず保持し、生成された1024 px版とモノクロ版も参考資産へ保存する。
- 同じモノクロ版を `assets/branding/app_logo_monochrome.png` にも出力し、ホームの背景ロゴに使用する。Mと本の造形を維持し、表示時に本文色の4.5%で薄く重ねる。

Android資産の寸法とマスクは[公式のAdaptive icons仕様](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive)に従う。

## 受け入れ基準

- Androidの丸型・角丸型とiOSのマスクでMと本が切れない。
- Androidのテーマ付き表示で旧アイコンが残らない。
- iOSカタログ画像には透明ピクセルを含めない。
- 提供原本とランチャーの造形・配色が整合する。
- `06_ACCEPTANCE_TESTS.md` のA19を満たす。
