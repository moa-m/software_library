# 男性ヒーロー写真の手元修正

- 修正日: 2026-10-28
- 方法: built-in ImageGenで既存写真を編集
- 対象: `public/images/nuupamo/lp/source/hero-man-shopping.png`
- 修正前原本: `/Users/moa/.codex/generated_images/01a180e9-05f3-73a2-9e2d-c4a55a0eb9f7/exec-2c277988-a154-4f82-b7af-6b395a7b8da1.png`
- 修正後原本: `/Users/moa/.codex/generated_images/01a17b3a-c5c8-7331-b454-a2ed0bb44fa9/exec-77b882a5-fb33-465c-aa3c-9e44ed3ac09f.png`
- サイズ: 1024 × 1536
- 変更: 手の重なりを減らし、片手で縦向きスマホを支え、もう片方の人差し指で操作する持ち方へ変更。顔・身だしなみ・右向きの視線・売場とカート・明るい色調を維持。
- 検視: 指の付け根と手首の接続、保持する手と操作する手の分離、端末と指の重なりを原寸・拡大で確認。文字やUIの混入なし。

## 最終プロンプト

```text
Use case: precise-object-edit / anatomical hand correction.
The attached photo is the EXACT EDIT TARGET. Target dimensions 1024 x 1536 portrait, keep source framing.
Repair ONLY the man's HANDS, wrists and their immediate grip on his handheld smartphone. The current overlapping fingers look fused and anatomically confusing. Repose the hands to a very simple, clear, believable phone-use gesture:
One hand comfortably cradles the smartphone at its lower half, supporting its weight from beneath and along a side edge. That wrist connects naturally to its forearm. The other hand is visibly separate with a small natural gap, its index finger reaching gently around toward the screen on the man's side to tap; remaining fingers are loosely bent and relaxed, thumb in a natural position. Fingers must not cross or merge between hands. Anatomically correct hand size, palm shape, finger lengths, knuckles, joints, nails and wrist proportions. Five digits per hand in total, with natural occlusion; do not try to display every digit. No duplicate fingertips or thumbs, no fingers fused into phone, no elongated fingers, no joint bends backwards. Make the grip's anatomy instantly readable at full size.
The phone remains a single normal thin smartphone, same gray BACK visible to viewer and display facing the man. The actual screen must remain hidden. Keep its size, orientation and approximate chest-level location. Keep the man's downward gaze aimed at it. Adjust only the minimum nearby cuff/forearm positioning necessary for the natural hands.

STRICT INVARIANTS: Preserve the same man/face/identity, neat short haircut, clean-shaven natural skin, gentle expression, head and shoulders turned slightly IMAGE RIGHT, pale solid blue-gray Oxford shirt and white T-shirt, tidy beige pants, supermarket shelves, cart/groceries, object placement, camera angle, depth of field, warm soft lighting and color palette. No change to the woman's assets or any other image. Do not redesign or recompose. No text, logos, app UI, labels, watermark, large mockups, illustration or CGI. Maintain realistic photographic skin texture.
Output only one corrected photograph.
```
