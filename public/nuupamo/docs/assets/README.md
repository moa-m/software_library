# NUUPAMO LP用アセット

制作日: 2026-10-28。承認済みの「全体2案目＋共有セクションは1案目」を基準に制作しました。

- [素材プレビュー](index.html)
- [承認済みの全体イメージ](approved-lp.png)
- [全ファイルの寸法・容量・出典・SHA-256](../../../images/nuupamo/lp/manifest.json)
- 配信用画像: `public/images/nuupamo/lp/`
- 生成写真のPNG原本: `public/images/nuupamo/lp/source/`

## 配置

| LPの場所 | 配信用ファイル | 用途・配置 |
|---|---|---|
| ヒーロー左 | `hero-woman-home.webp` | 自宅でスマホを見る女性。画像左向き。縦位置を保ち、頭・手元を切らない |
| ヒーロー右 | `hero-man-shopping.webp` | 店舗でスマホを見る男性。画像右向き。女性と離れた背景として配置 |
| ヒーローの端末 | `phone-ios-shopping.webp`、`phone-android-shopping.webp` | 実スクリーンショット＋既存の端末枠。透明背景。高さを揃え、OS名と識別アイコンをHTMLで添える |
| 買い物メモ | `item-handsoap-memo.webp` | ユーザー提供の `handsoap002.png` を透明部分・外枠ごと最適化。赤髪のアバター、メモ「ミントがなかったらピーチ」 |
| 家で気づく | `story-at-home.webp` | 洗面台・蛇口のそばでハンドソープを確認する写真。見出しや操作カードは別に重ねる |
| お店で確認 | `story-at-store.webp` | 店舗でスマホを確認する写真。端末の背面のみで架空のUIを含まない |
| 買ったら戻すの実カード | `item-handsoap-stock.webp` | ユーザー提供の `handsoap001.png` を最適化。緑のマークと担当者を表示し、メモは表示しない |
| 買ったら戻す | `story-back-home.webp` | 洗面台の蛇口横へハンドソープを戻す写真。家で気づく写真とボトル・室内・袖を揃えたもの |
| 共有セクション右 | `phone-android-members.webp` | 実際のメンバー画面を端末枠へ合成。瑞希・悠斗・ももを表示 |
| 共有セクションの6カテゴリ | `category-food.webp`、`category-daily.webp`、`category-baby.webp`、`category-medical.webp`、`category-pet.webp`、`category-other.webp` | アプリ既存のカテゴリ画像。見出しとカテゴリ名はHTMLで添える |
| 補助素材 | `item-handsoap-icon.webp`、`avatar-mizuki.webp` | アプリ既存の手洗いアイコンと赤髪アバター。LPのカード表示には提供された実画像を使用 |
| フッター | `footer-still-life.webp` | 中央を空けた横長の植物・本・カップ。ロゴ・文章・CTAは別レイヤー |
| 共通ロゴ | `brand-icon.webp` | 現行アプリアイコンの最適化版。ワードマークはHTMLで添える |
| OS・共有・操作の識別 | `icons/apple.svg`、`icons/android.svg`、`icons/cloud.svg`、`icons/arrow-right.svg`、`icons/tap.svg`、`icons/star.svg` | Bootstrap Iconsの既存SVG。ライセンスは下記 |

元のアプリ画面全体も、`screen-ios-shopping.webp`、`screen-android-shopping.webp`、`screen-ios-stock.webp`、`screen-android-members.webp` として収録しています。端末枠が不要な場所や画面の更新時に使えます。

## 実装時の扱い

- 人物写真は通常の明るさで保存しています。承認案の薄い表現は、配置した写真レイヤーの `opacity` と単色の背景レイヤーで調整します。背景用に使う場合のaltは空にし、説明は前景の本文に置きます。
- 写真6点には `-small.webp` もあります。人物・手元写真は600px幅、フッターは1086px幅です。大きい画像と `srcset` で出し分けられます。各画像の実寸はmanifestに記録しています。
- 端末モックは透明なWebPです。周囲に白い四角や別の端末枠を足さず、そのまま配置できます。画面と端末枠を別々に再描画しません。
- アプリ画面・アイテムカード内の文字は実画面に含まれるものです。LPの見出し、説明、料金、カテゴリ名、OS名、CTAは画像に焼き込まずHTMLで実装します。
- 拡大カードのalt例: `ハンドソープの買い物カード。担当者のアバターと買い物メモ「ミントがなかったらピーチ」を表示。`
- 2状態のカードは、提供された実画面の画像を使用します。`item-handsoap-memo.webp` は「買うもの」、`item-handsoap-stock.webp` は「あるもの」です。画像にCSSの角丸・枠を重ねず、元画像の外枠と透明部分を保持します。
- アプリ既存のカテゴリ・アイテムアイコンは原寸48pxです。24CSS px程度での表示を推奨します。大きく見せるカードには1000px幅の `item-handsoap-memo.webp` を使えます。
- PNG原本や承認済みの全体イメージは制作資料です。通常のLPでは軽量なWebP/SVGを読み込みます。

## 出典・生成記録

写真6点はbuilt-in ImageGenで制作し、すべて個別に生成・検視しました。CLI/APIフォールバックは使っていません。

- [女性写真のプロンプト](prompt-hero-woman.md)
- [男性写真のプロンプト](prompt-hero-man.md)
- [買い物の流れ3点のプロンプト](prompt-story.md)
- [フッター写真のプロンプト](prompt-footer.md)
- [男性の身だしなみ・店舗写真の服装統一](prompt-man-grooming-revision.md)
- [男性ヒーロー写真の手元修正](prompt-man-hands-revision.md)
- [女性のパンツを濃いグレーへ変更](prompt-woman-pants-revision.md)
- [ハンドソープ・洗面台の写真への変更](prompt-handsoap-scenes-revision.md)

ブラウザーコメントに基づき、男性のヒーロー写真は髪型・ひげ・シャツのしわを整え、店舗の手元写真も同じシャツへ統一しました。女性のパンツは濃いグレーへ変更しています。PNG原本・通常WebP・軽量WebPへ反映済みです。`approved-lp.png` は構成確認用の承認時点の資料として保持しており、LP実装には修正済みの個別素材を使用します。

追加コメントに基づき、スクリーンショット・端末モックは更新済みの原本から再作成し、拡大カードと操作アイコンもハンドソープへ変更しています。旧 `item-shampoo-*` の配信用ファイルは差し替え済みです。

画面は `public/images/nuupamo/screenshot/` の現行画像を使用。カテゴリ・手洗いアイコン・アバターは `/Users/moa/Project/Mobile_Project/stocky/assets/images/` の実素材、ブランドアイコンは `public/images/nuupamo/icon.png` を使用しました。アプリ側のファイルは変更していません。

端末枠はProduct Design 0.1.56の同梱テンプレート素材（`iphone/Bezel.png`、`android/Pixel10.png`）を使用しています。実画面の比率を維持し、テンプレートの画面開口に合わせてクリップ・合成しました。

標準SVGは[Bootstrap Icons v1.11.3](https://github.com/twbs/icons/tree/v1.11.3/icons)の既存アイコンを使用し、線形状は変更せず色のみ指定しています。[MITライセンス全文](bootstrap-icons-LICENSE.txt)を同梱しました。画像生成によるApple・Androidマークの近似は使っていません。

## 再書き出し

この制作環境では `node public/nuupamo/docs/assets/prepare-assets.cjs` をリポジトリのルートから実行すると、配信用WebP・合成端末・manifest・一覧HTMLを再作成できます。写真の再生成は行いません。実画面・原本・アプリ素材・Product Design同梱素材の元パスはスクリプトに記録しています。

これらの素材を使用したLP本体は `public/nuupamo/index.html`、スタイルは `public/nuupamo/style.css` に実装しています。料金のチェック表示には、同じBootstrap Iconsの `icons/check.svg`（check-lg）を追加しています。

2026-10-28の追加提供: `handsoap001.png`（あるもの、1000 × 308）と `handsoap002.png`（買うもの、1000 × 476）を可逆WebPへ変換しました。実画像内の文字や更新日時は変更していません。再書き出し時はLP内の画像URLの内容ハッシュも更新します。

操作説明のタップマークは、ユーザー指定の `public/images/tap_white.png` をLPから直接参照し、CSSで左へ18度傾けて配置しています。原本の再描画は行っていません。

タップした位置の強調には、同じBootstrap Icons v1.11.3の `triangle-fill.svg` を赤くした `icons/tap-triangle.svg` を3個配置しています。FAQ・本文は意味の区切りで改行し、料金のチェックは文章の1行目の直前に配置しています。
