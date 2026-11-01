# ヒーロー男性写真の生成記録

最新版: [男性の身だしなみ修正記録](prompt-man-grooming-revision.md)。以下は初回生成時の記録です。

- 制作日: 2026-10-28
- 方式: built-in image_gen（CLIは使用していません）
- 出力: `images/nuupamo/lp/source/hero-man-shopping.png`
- サイズ: 1024 × 1536 px
- 原本: `/Users/moa/.codex/generated_images/01a180e9-05f3-73a2-9e2d-c4a55a0eb9f7/exec-88920fa4-2a75-4162-95bf-4cdf7f91879b.png`
- 参照: 承認済みLP全体案 `exec-64f43731-7e16-4c48-a0a7-9f6a6561ca7f.png`、承認済みヒーロー `exec-b712b15a-cf12-4017-8005-63d33b8aa058.png`
- 用途: LPの右側ヒーロー写真。薄さはHTML/CSSのopacityで調整し、原本に焼き込んでいません。
- 検視: 顔と肩は画像右向き、視線は手元のスマートフォン。頭・両手・スマートフォンはキャンバス内。手指・顔の重大な破綻なし。画面UI・文字・ロゴ・大型モックは含みません。

## 最終プロンプト

```text
Use case: photorealistic-natural.
Asset type: individual hero background photograph for an existing Japanese household shopping-list app landing page.
Input images: both attached images are approved visual-reference material only. Use the man from these references as identity, clothing, pose-direction, natural-photography and scene grounding. Do NOT reproduce the website, text, device mockups or app screens.
Primary request: create ONE standalone realistic photograph of the same Japanese man in his early-to-mid 30s checking his own small smartphone in a supermarket.
Target dimensions: 1024 x 1536 portrait, natural proportions.
Subject: preserve the reference man's soft wavy dark hair, friendly natural face and blue-gray casual overshirt over an off-white T-shirt. He is positioned near center, very slightly to the right. He turns his head AND shoulders slightly toward IMAGE RIGHT (the outside right edge), nose clearly pointing to the right in a relaxed three-quarter view. His eyes look DOWN at his own phone held naturally to his right. He must not face left or look toward a partner. Smartphone BACK faces the viewer; screen is toward the man and not visible.
Composition: complete head and hair with about 10% headroom, both natural hands and the entire phone inside the canvas, approximately from head to above knees. Keep sufficient side background so responsive cropping is possible. A shopping cart with a few groceries can be subtly present in the lower area, as in reference; do not hide his hands.
Scene: clean everyday supermarket grocery aisle, softly blurred produce and shelves, no readable package brands or signs. Warm off-white/neutral overall palette that fits a cream/taupe Japanese website.
Lighting: soft bright diffused natural-looking light, normal usable photographic contrast, warm but not yellow. Do NOT bake in transparency, a white fade or washed-out opacity; the website will apply opacity separately.
Style: candid editorial lifestyle photograph, believable skin and fabric detail, no posed advertising grin.
Constraints: photograph ONLY. No website, words, logo, app UI, oversized device mockup, symbols, arrows, frame, border, illustration, anime, 3D, watermark or collage. Exactly one person. Natural anatomy and realistic fingers. Output one photo.
```

