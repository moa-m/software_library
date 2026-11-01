# 男性写真の身だしなみ修正記録

- 修正日: 2026-10-28
- 方式: built-in image_genによる既存画像編集（CLI不使用）
- ユーザー依頼: 男性の服装・髪型などを清潔感のある身だしなみに整え、関連写真の衣装も揃える。
- 元の生成原本は削除していません。以下のLP用PNGは修正版で上書きしました。
- 最新のヒーロー写真では、[手元の修正](prompt-man-hands-revision.md)も反映しています。

## 変更した素材

| 素材 | サイズ | 修正前の生成原本 | 修正後の生成原本 |
|---|---|---|---|
| `images/nuupamo/lp/source/hero-man-shopping.png` | 1024 × 1536 | `/Users/moa/.codex/generated_images/01a180e9-05f3-73a2-9e2d-c4a55a0eb9f7/exec-88920fa4-2a75-4162-95bf-4cdf7f91879b.png` | `/Users/moa/.codex/generated_images/01a180e9-05f3-73a2-9e2d-c4a55a0eb9f7/exec-2c277988-a154-4f82-b7af-6b395a7b8da1.png` |
| `images/nuupamo/lp/source/story-at-store.png` | 1254 × 1254 | `/Users/moa/.codex/generated_images/01a180e9-6fc1-72a0-92a0-18227830f90b/exec-37c50986-3540-485b-a7bc-61e1f6d17894.png` | `/Users/moa/.codex/generated_images/01a180e9-05f3-73a2-9e2d-c4a55a0eb9f7/exec-a5274295-2c07-4a67-b1de-8dd7b5adbda8.png` |

## 検視結果

- ヒーロー: 顔の同一性、画像右向き・手元のスマホを見る姿勢、自然な笑顔、スーパー・カート・光・構図を維持。サイドと襟足をすっきり整え、乱れた束・はねを抑えた髪型。頬・顎のひげ影を取り除き、自然な肌の質感を保持。
- 衣装: 淡いブルーグレー系の無地Oxfordシャツに揃え、襟、袖、前身頃、裾を整えた。白Tシャツとベージュのパンツも過度なしわを抑制。自然な着用に伴う細かな折り目・布地の織りは残る。
- 手元写真: ヒーローと同系色・質感のシャツを参照し、袖・前身頃のしわと柄に見えるむらを整理。元の手、スマホ背面、カート、店内構図、光を維持。
- 両素材ともUI、文字、ロゴ、アプリ画面の混入なし。顔・手指に重大な破綻なし。画像サイズは元と同一。

## ヒーロー編集の最終プロンプト

```text
Use case: precise-object-edit / identity-preserve.
The attached photograph is the EXACT EDIT TARGET. Output one revised 1024 x 1536 portrait photograph, same composition, pose, identity, supermarket, cart, smartphone, hands, framing, gentle smile, light and color palette. Change ONLY this man's grooming and clothing neatness.

Hair: same natural dark hair and hairline but a shorter, professionally tidy everyday haircut. Neatly trim the sides and nape, remove unruly tufts, bedhead, excessive clumped spiky strands, and loose hanging fringe. Keep a modest natural top volume with a clean side sweep; no hair across eyes or face. Not a dramatic fashion change or skin fade.
Face: preserve the man's identity, age, skin features and gentle smile. Clean-shaven cheeks, jaw and chin; remove patchy stubble and visible beard shadow while keeping believable skin texture. Do not make the skin plastic, waxy, unnaturally white or airbrushed.
Shirt: same light blue-gray color family, now a PLAIN solid-color cotton OXFORD shirt with a clean pressed collar, minimal neat creases, no crumpled linen-like texture, check pattern, pilling, wrinkles, sagging or loose untidy layered hems. Preserve casual sleeves appropriate to supermarket shopping, but make cuffs tidy and garment silhouette neat. The white crewneck T-shirt underneath is clean and smooth, not wrinkled or hanging untidily below the shirt. Neat beige pants with minimal wrinkles. Everyday casual household shopping style, not a suit, tie, uniform, office headshot or formal styling.

Strict invariants: head and shoulders remain slightly turned toward IMAGE RIGHT, looking DOWN at his own smartphone held naturally to his right. Phone BACK remains visible to viewer, screen hidden. Preserve exact hands, phone, cart, groceries, camera angle, light, background and subject position; do not mirror or recompose. Keep complete head/hair and both hands/phone inside canvas. No text, logos, UI, app screen, badges, arrows or watermarks. Normal usable photographic contrast; do not bake in transparency or white fade. Only tidy grooming and clothing as requested.
```

## 店内手元写真編集の最終プロンプト

```text
Use case: precise-object-edit / compositing wardrobe continuity.
Input 1: revised full-height photograph of the man, the authoritative clothing and color reference.
Input 2: the EXACT EDIT TARGET, a square close-up photo of his hands holding a phone in a supermarket. Output ONE square 1254 x 1254 photograph matching Input 2 composition exactly.

Change ONLY the visible shirt front and sleeves in Input 2 to match Input 1's neat pale BLUE-GRAY solid-color cotton OXFORD shirt: same shade, subtle fine cotton texture, clean smooth pressed appearance, minimal natural folds, no mottled check pattern, creased linen appearance, severe wrinkles, pilling or sagging. The white T-shirt glimpse should be smooth and clean. Keep ordinary casual clothing, not suit or formal dress.

Strict invariants: preserve Input 2's hands, fingers, phone BACK, smartphone orientation, cart handle, supermarket background, shelves, subject crop, object placement, soft light, photographic realism, warm neutral palette and composition. Do not introduce the man's head or face into this close-up. No new objects. No screen content, app UI, brands, readable text, graphic mockups, arrows, icons, labels or watermark. Phone screen stays toward the subject and hidden from viewer. Do not mirror or recompose. Preserve image dimensions and square aspect ratio. Output the edited photograph only.
```

