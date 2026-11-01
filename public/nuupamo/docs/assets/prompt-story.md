# 買い物の流れ：写真素材の生成記録

最新の自宅・帰宅写真は、ユーザー依頼によりハンドソープと洗面台の構図へ変更しました。[修正プロンプトと検視記録](prompt-handsoap-scenes-revision.md)を参照してください。以下の初回制作記録は履歴として保持しています。

制作日: 2026-10-28
生成方法: built-in image_gen（CLI/APIへのフォールバックなし）
共通参照: /Users/moa/.codex/generated_images/01a17b3a-c5c8-7331-b454-a2ed0bb44fa9/exec-64f43731-7e16-4c48-a0a7-9f6a6561ca7f.png

各画像は写真部分のみ。操作説明文・実アイテムカードは含めず、LP実装時にHTMLと実データで組み合わせます。スクリーンショットを捏造しないため、店舗写真のスマートフォンは背面を向けています。

## story-at-home.png

保存先: ../../../images/nuupamo/lp/source/story-at-home.png
生成原本: /Users/moa/.codex/generated_images/01a180e9-6fc1-72a0-92a0-18227830f90b/exec-e5d08d20-4022-41c4-b137-c185af4446e9.png
生成時指定: 1024 × 1024（square）。実出力: 1254 × 1254。
検視: 白い無地ポンプ容器を確認する手、自然な指、顔・文字・UIなし。主役のボトル全体を確認。

```text
Use case: photorealistic-natural. Generate one individual photographic asset for the approved NUUPAMO landing page. The attached full-page design is a style and composition reference ONLY, not an edit target. Generate the photo alone, no webpage.
Target dimensions 1024 x 1024 square.
Scene: warm bright Japanese home bathroom/washbasin corner, ivory and light beige, soft natural daylight, pale wood counter, clean gentle lived-in detail. A white unbranded shampoo pump bottle stands beside another simple white toiletry bottle near the basin. A woman's natural hand emerging from a plain ivory knit sleeve lightly picks up/checks the shampoo bottle to see what is left. No woman's face. Keep hand anatomically natural, bottle intact and visible, no gripping distortion. Still life and hand occupy lower half/middle of frame; upper third is softly blurred quiet beige wall/background. White ceramic basin edge and subtle linen are fine, uncluttered.
Match the approved page's home/store/return story photographic mood: calm soft realistic editorial photography, restrained saturation, cream/white/light wood, high quality product detail, gentle shadows. Full usable photograph, not a cutout, no artificial transparency or baked-in fade. No exaggerated empty-bottle distress or product claims.
NO TEXT, NO LOGOS, NO PACKAGING LETTERING, NO UI, NO APP SCREEN, NO PHONE, NO CARDS, NO ARROWS, NO NUMBERS, NO WATERMARK. Do not reproduce the landing-page layout. Output one photo.
```

## story-at-store.png

保存先: ../../../images/nuupamo/lp/source/story-at-store.png
生成原本: /Users/moa/.codex/generated_images/01a180e9-6fc1-72a0-92a0-18227830f90b/exec-37c50986-3540-485b-a7bc-61e1f6d17894.png
生成時指定: 1024 × 1024（square）。実出力: 1254 × 1254。
検視: 青グレーの袖、自然な手、スマートフォン背面、棚はボケ。画面UI・可読文字なし。

```text
Use case: photorealistic-natural. Generate one individual photographic asset for the approved NUUPAMO landing page. Attached full-page design is a style and lighting reference, not an edit target. Photo alone, no webpage.
Target dimensions 1024 x 1024 square.
Scene: Japanese supermarket household toiletries aisle. Natural close-up of a Japanese adult man's hands and forearms in a muted blue-gray casual shirt checking his own smartphone while shopping. No face in frame. Show ONLY the smartphone's plain neutral gray BACK and a thin edge, because its display faces the man; NO visible screen. Keep phone held comfortably with anatomically natural hands and fingers. A lightly visible wire shopping cart can be near lower edge. Toiletry shelves behind are softly defocused, anonymous plain white/beige/pastel product packages, no readable brands or packaging letters. The phone/hands are middle/lower portion, upper third soft quiet supermarket bokeh with usable space.
Soft warm-neutral editorial photography to match cream, white, pale wood household campaign; natural realistic light, subdued color, gentle shadows, no harsh dramatic lighting. Do not reproduce entire landing page or any device mockups.
NO TEXT, NO LOGOS, NO PACKAGING LETTERING, NO SCREEN UI, NO APP CONTENT, NO CARDS, NO ARROWS, NO NUMBERS, NO WATERMARK. Do not invent NUUPAMO UI. Output one photo only.
```

## story-back-home.png

保存先: ../../../images/nuupamo/lp/source/story-back-home.png
生成原本: /Users/moa/.codex/generated_images/01a180e9-6fc1-72a0-92a0-18227830f90b/exec-ddad7edd-d415-4bcf-bf75-c0eed0f3b06a.png
追加参照: story-at-home.png の生成原本（同じボトル・袖・室内・光を維持するため実際に添付）
生成時指定: 1024 × 1024（square）。実出力: 1254 × 1254。
検視: 自宅画像と同じ室内・ポンプ形状。容器の底は木の台に自然に接地し、指・袖に大きな破綻なし。文字・UIなし。

```text
Use case: photorealistic-natural. Generate one standalone photographic asset for NUUPAMO's home/store/return story. Input image 1 is the approved full-page design STYLE reference, not an edit target. Input image 2 is the actual already-generated AT-HOME photo and is the EXACT continuity reference for bottle, room, sleeve and daylight.
Target dimensions 1024 x 1024 square.
Photograph a later moment at the SAME Japanese washbasin corner as image 2: the SAME white unbranded rounded rectangular shampoo pump bottle and matching simple white toiletry bottle, the same light wooden counter beside a white basin, cream wall, warm natural light, clean ivory linen and small green plant. A woman's hand in the SAME plain ivory knit sleeve gently returns/sets the now-bought shampoo pump bottle upright on the counter or small shelf beside the other bottle. No face, no full person. The bottle is completely visible, its bottom naturally contacting the counter, pump upright, no tilted lifted-checking pose. The woman's natural fingers rest lightly on its side/top as she finishes placing it; realistic anatomy. This visually feels like returning a purchased household supply home. Slightly wider composition than image 2, products and hand lower-middle, upper third quiet blurred room with space.
Maintain the same bottle shape, warm pale cream/white/light wood colors, gentle photo contrast and soft editorial photographic style as image 2. Not an illustration, not a montage. Full usable photo; no baked opacity, no transparency.
NO TEXT, NO LABEL LETTERING, NO LOGOS, NO UI, NO APP SCREEN, NO PHONE, NO CARDS, NO ARROWS, NO NUMBERS, NO WATERMARK. Output only one photo, not a landing page.
```

