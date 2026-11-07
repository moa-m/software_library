# Bundled document fonts

Source: https://github.com/google/fonts/tree/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl

The complete upstream TTFs are bundled without glyph subsetting or modification.
Noto uses variable weights; Klee One provides Regular (400) and SemiBold (600).
Each family retains its upstream SIL Open Font License 1.1 in OFL.txt.

| Asset | Bytes | SHA-256 |
| --- | ---: | --- |
| notosansjp/NotoSansJP-Variable.ttf | 9589900 | `c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f` |
| notosansjp/OFL.txt | 4388 | `1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9` |
| notoserifjp/NotoSerifJP-Variable.ttf | 13574352 | `2fd527ba12b6a44ec30d796d633360da0aeba6c5d4af1304ce12bb4dc15a7dfc` |
| notoserifjp/OFL.txt | 4350 | `5e0da210fb04058a8c0087985d2d456b931c2579811a49655721d3cf0c36b6d6` |
| kleeone/KleeOne-Regular.ttf | 8724204 | `bf4063f030cc2ae6adf0a11424a1888e5c0eb4438f1f6d02f52294af868e9b3a` |
| kleeone/KleeOne-SemiBold.ttf | 8905128 | `b031ec426c23ca1143ef1f7d58bee7a79efe119ed654152f121c922202b303fd` |
| kleeone/OFL.txt | 4479 | `e376b0df8e8a2345a9533db6f0a5333a1107975569ad9d1973a7ee557161ca38` |

## LP制作への引継ぎ

上表はアプリ同梱フォントの情報。TTF本体はこのパッケージには含めない。Webへのフォント導入はLP側で別途判断する。

- [Noto Sans JPのOFL](licenses/NotoSansJP-OFL.txt)
- [Noto Serif JPのOFL](licenses/NotoSerifJP-OFL.txt)
- [Klee OneのOFL](licenses/KleeOne-OFL.txt)
