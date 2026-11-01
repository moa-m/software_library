// 実画面の切り出し・既存端末枠との合成・配信用画像の書き出し。
// 写真の新規作成・人物の編集は ImageGen で行い、この処理では再描画しない。
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const publicRoot = path.resolve(__dirname, '../../..');
const out = path.join(publicRoot, 'images/nuupamo/lp');
const appImages = '/Users/moa/Project/Mobile_Project/stocky/assets/images';
const templateAssets = '/Users/moa/.codex/plugins/cache/openai-curated-remote/product-design/0.1.56/templates/mobile-app/public/assets';
const generated = '/Users/moa/.codex/generated_images/01a17b3a-c5c8-7331-b454-a2ed0bb44fa9';
const records = [];

async function record(file, group, alt, source, extra = {}) {
    const full = path.join(out, file);
    const data = await fs.readFile(full);
    const meta = await sharp(data).metadata();
    records.push({
        file, group, alt, width: meta.width, height: meta.height,
        bytes: data.length, alpha: meta.hasAlpha,
        sha256: crypto.createHash('sha256').update(data).digest('hex'),
        source, ...extra,
    });
}

async function webp(input, file, group, alt, options = {}) {
    let img = sharp(input);
    if (options.width) img = img.resize({ width: options.width, withoutEnlargement: true });
    // プレビュー表示中の再書き出しでも、書き込み途中の画像が配信されないよう置き換える。
    const encoded = await img.webp({ quality: options.quality || 88, lossless: options.lossless || false, effort: 6 }).toBuffer();
    const temporary = path.join(out, `${file}.tmp`);
    await fs.writeFile(temporary, encoded);
    await fs.rename(temporary, path.join(out, file));
    await record(file, group, alt, typeof input === 'string' ? input : options.source, options.extra);
}

async function phone(file, screenName, device, alt) {
    const ios = device === 'ios';
    const framePath = path.join(templateAssets, ios ? 'iphone/Bezel.png' : 'android/Pixel10.png');
    const frame = await fs.readFile(framePath);
    const screenPath = path.join(publicRoot, 'images/nuupamo/screenshot', screenName);
    const box = ios ? { left: 177, top: 174, width: 1179, height: 2556 } : { left: 140, top: 70, width: 854, height: 1904 };
    const resized = await sharp(screenPath).resize(box.width, box.height, { fit: 'contain', background: '#efece9' }).png().toBuffer();
    // 既存テンプレートの画面開口に合わせてクリップ。端末の外へ四角い画面がはみ出すのを防ぐ。
    const radius = ios ? 126 : 116;
    const mask = Buffer.alloc(box.width * box.height * 4, 255);
    for (let y = 0; y < box.height; y++) {
        for (let x = 0; x < box.width; x++) {
            const dx = Math.max(radius - x - 0.5, x + 0.5 - (box.width - radius), 0);
            const dy = Math.max(radius - y - 0.5, y + 0.5 - (box.height - radius), 0);
            mask[(y * box.width + x) * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, radius + 0.5 - Math.hypot(dx, dy))));
        }
    }
    const screen = await sharp(resized).composite([{ input: mask, raw: { width: box.width, height: box.height, channels: 4 }, blend: 'dest-in' }]).png().toBuffer();
    const frameMeta = await sharp(frame).metadata();
    const canvas = sharp({ create: { width: frameMeta.width, height: frameMeta.height, channels: 4, background: '#00000000' } });
    const screenLayer = { input: screen, left: box.left, top: box.top };
    const frameLayer = { input: frame, left: 0, top: 0 };
    const combined = await canvas.composite(ios ? [screenLayer, frameLayer] : [frameLayer, screenLayer]).png().toBuffer();
    const cropped = await sharp(combined).trim({ threshold: 2 }).png().toBuffer();
    await webp(cropped, file, '端末モック', alt, {
        width: 760, quality: 96, source: `${screenPath} + ${framePath}`,
        extra: { method: '実スクリーンショットを縦横比を保って既存端末枠へ合成。UI・文字・アバターを再描画しない。' },
    });
}

async function main() {
    await fs.mkdir(path.join(out, 'source'), { recursive: true });
    await fs.copyFile(path.join(generated, 'exec-0fd48e0f-721b-4081-920c-39eb8b43f3d2.png'), path.join(out, 'source/footer-still-life.png'));
    await fs.copyFile(path.join(generated, 'exec-64f43731-7e16-4c48-a0a7-9f6a6561ca7f.png'), path.join(__dirname, 'approved-lp.png'));

    const photos = [
        ['hero-woman-home', '白いニットと濃いグレーのパンツで、自宅でやや左を向いてスマートフォンを確認する女性', 1024],
        ['hero-man-shopping', '整えた短髪としわの少ないブルーグレーのシャツで、買い物先でやや右を向いてスマートフォンを確認する男性', 1024],
        ['story-at-home', '洗面台と蛇口のそばで、ハンドソープのボトルを手に取って確認する様子', 1000],
        ['story-at-store', 'ヒーローと同じ無地のブルーグレーのシャツで、日用品売場でスマートフォンを確認する手元', 1000],
        ['story-back-home', '購入したハンドソープを洗面台の蛇口横へ戻す様子', 1000],
        ['footer-still-life', '植物と本、カップを両端に配置した明るい木のカウンター', 2172],
    ];
    for (const [name, alt, width] of photos) {
        const source = path.join(out, 'source', `${name}.png`);
        await webp(source, `${name}.webp`, '写真', alt, { width, extra: { generated: true } });
        await webp(source, `${name}-small.webp`, '写真・軽量版', alt, { width: name === 'footer-still-life' ? 1086 : 600, quality: 84, extra: { generated: true } });
    }

    const screens = [
        ['iOS001.png', 'screen-ios-shopping', 'iOSの買うもの一覧。担当者と買い物メモを確認できる画面'],
        ['Android001.png', 'screen-android-shopping', 'Androidの買うもの一覧。iOSと同じリストを表示した画面'],
        ['iOS002.png', 'screen-ios-stock', 'iOSのあるもの一覧。名前検索とカテゴリ絞り込みの画面'],
        ['Android004.png', 'screen-android-members', 'Androidのメンバー画面。瑞希、悠斗、その他のメンバーのももを表示'],
    ];
    for (const [src, name, alt] of screens) {
        await webp(path.join(publicRoot, 'images/nuupamo/screenshot', src), `${name}.webp`, '実スクリーンショット', alt, { lossless: true });
    }
    await phone('phone-ios-shopping.webp', 'iOS001.png', 'ios', 'iPhoneの端末枠に収めたNUUPAMOの買うもの一覧');
    await phone('phone-android-shopping.webp', 'Android001.png', 'android', 'Androidの端末枠に収めたNUUPAMOの買うもの一覧');
    await phone('phone-android-members.webp', 'Android004.png', 'android', 'Androidの端末枠に収めたNUUPAMOのメンバー画面');

    // ユーザー提供の実カードをそのまま使用。文字・枠・角・透明部分を保持する。
    await webp(path.join(out, 'handsoap002.png'), 'item-handsoap-memo.webp', '実画面の部分', 'ハンドソープの買い物カード。赤髪の担当者、買い物メモ「ミントがなかったらピーチ」を表示', { lossless: true });
    await webp(path.join(out, 'handsoap001.png'), 'item-handsoap-stock.webp', '実画面の部分', 'あるものへ戻したハンドソープの実カード。緑のマーク、担当者を表示し、買い物メモは表示しない', { lossless: true });

    const native = [
        ['default/default_food.png', 'category-food', '食材'],
        ['default/default_daily.png', 'category-daily', '日用品'],
        ['default/default_baby.png', 'category-baby', 'ベビー用品'],
        ['default/default_medical.png', 'category-medical', '医薬・衛生用品'],
        ['default/default_pet.png', 'category-pet', 'ペット用品'],
        ['default/default_other.png', 'category-other', 'その他'],
        ['daily/daily_015.png', 'item-handsoap-icon', 'ハンドソープを示す手洗いのアイコン'],
        ['avatar/006.png', 'avatar-mizuki', '瑞希の赤髪のアバター'],
    ];
    for (const [src, name, alt] of native) {
        await webp(path.join(appImages, src), `${name}.webp`, 'アプリ既存素材', alt, { width: 256, lossless: true });
    }
    await webp(path.join(publicRoot, 'images/nuupamo/icon.png'), 'brand-icon.webp', 'アプリ既存素材', 'NUUPAMOアプリアイコン', { width: 256, lossless: true });

    const icons = [
        ['apple', '#191919', 'iPhone・iOSを示すAppleマーク'],
        ['android', '#64b32e', 'Androidを示すロボット'],
        ['cloud', '#6f6258', '同じリストの共有を示すクラウド'],
        ['arrow-right', '#6f6258', '右向きの矢印'],
        ['tap', '#3b3734', 'カードをタップする操作'],
        ['tap-triangle', '#ff453d', 'タップ位置を強調する赤い三角'],
        ['star', '#ffc85b', 'お気に入り'],
        ['check', '#6f6258', '料金プランの内容を示すチェックマーク'],
    ];
    for (const [name, color, alt] of icons) {
        const file = `icons/${name}.svg`;
        const filename = path.join(out, file);
        const svg = (await fs.readFile(filename, 'utf8')).replace('fill="currentColor"', `fill="${color}"`);
        await fs.writeFile(filename, svg);
        await record(file, '標準SVGアイコン', alt, `Bootstrap Icons v1.11.3, ${name === 'android' ? 'android2' : name === 'tap' ? 'hand-index-thumb' : name === 'check' ? 'check-lg' : name === 'tap-triangle' ? 'triangle-fill' : name}.svg`, { license: 'MIT; nuupamo/docs/assets/bootstrap-icons-LICENSE.txt' });
    }
    await fs.writeFile(path.join(out, 'manifest.json'), `${JSON.stringify({ date: '2026-10-28', approvedDesign: '../../../nuupamo/docs/assets/approved-lp.png', assets: records }, null, 4)}\n`);
    const lpPath = path.join(publicRoot, 'nuupamo/index.html');
    const hashes = Object.fromEntries(records.map(asset => [asset.file, asset.sha256.slice(0, 12)]));
    const lp = await fs.readFile(lpPath, 'utf8');
    await fs.writeFile(lpPath, lp.replace(/(\.\.\/images\/nuupamo\/lp\/)([^"\s?,]+)(?:\?v=[^"\s,]+)?/g, (match, prefix, file) => hashes[file] ? `${prefix}${file}?v=${hashes[file]}` : match));
    // 明示的にハンドソープへ差し替えた旧カードは、取り違えて使わないよう配信用一覧から退役する。
    for (const obsolete of ['item-shampoo-memo.webp', 'item-shampoo-icon.webp']) {
        await fs.rm(path.join(out, obsolete), { force: true });
    }
    const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const display = records.filter(a => a.group !== '写真・軽量版');
    const groups = [...new Set(display.map(a => a.group))];
    const gallery = groups.map(group => `<section><h2>${esc(group)}</h2><div class="grid ${group === '写真' ? 'photos' : ''}">${display.filter(a => a.group === group).map(a => `<figure><a href="../../../images/nuupamo/lp/${esc(a.file)}"><div class="image"><img src="../../../images/nuupamo/lp/${esc(a.file)}?v=${a.sha256.slice(0, 12)}" alt="${esc(a.alt)}" width="${a.width}" height="${a.height}" loading="lazy"></div></a><figcaption><strong>${esc(a.file)}</strong><span>${a.width} × ${a.height} px · ${(a.bytes / 1024).toFixed(1)} KB</span><p>${esc(a.alt)}</p></figcaption></figure>`).join('')}</div></section>`).join('');
    await fs.writeFile(path.join(__dirname, 'index.html'), `<!doctype html>
<html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>NUUPAMO LP 素材一覧</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#efece9;color:#3b3734;font-family:system-ui,sans-serif;line-height:1.7}main{width:min(1180px,100% - 40px);margin:40px auto}h1{font-size:clamp(24px,4vw,36px)}h2{margin-top:48px}a{color:#6f6258}a:focus-visible{outline:3px solid #148260;outline-offset:4px}.intro{max-width:760px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}figure{margin:0;background:#fbf9f8;border:1px solid #d8d1cb;border-radius:12px;overflow:hidden}.image{height:280px;display:flex;align-items:center;justify-content:center;padding:16px;background:#fff}img{display:block;max-width:100%;max-height:100%;width:auto;height:auto}.photos .image{height:360px;padding:0;background:#efece9}.photos img{width:100%;height:100%;object-fit:contain}figcaption{padding:16px;font-size:14px}figcaption strong{display:block;overflow-wrap:anywhere}figcaption span{color:#6f6258;font-size:12px}figcaption p{margin-bottom:0}details{margin:40px 0}summary{cursor:pointer}details img{margin:24px auto;max-height:none;width:min(560px,100%)}footer{padding:24px 0;border-top:1px solid #d8d1cb;font-size:14px}@media(max-width:700px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.image{height:220px}.photos .image{height:270px}figcaption{padding:12px}main{width:calc(100% - 24px);margin-top:24px}}@media(max-width:420px){.grid{grid-template-columns:1fr}.photos .image{height:360px}}
</style></head><body><main><header><h1>NUUPAMO LP 素材一覧</h1><p class="intro">承認済みデザイン用の写真・実画面・端末モックです。画像を選ぶと配信用ファイルを開けます。人物写真の薄さ、見出し、ボタン、料金表はLP実装時に調整します。</p><p><a href="README.md">配置・利用方法</a> · <a href="../../../images/nuupamo/lp/manifest.json">寸法・容量・出典一覧</a></p></header>${gallery}<details><summary>承認済みの全体イメージ</summary><img src="approved-lp.png" alt="2案目をベースに、共有セクションを1案目へ差し替えた承認済みLPの全体像" width="768" height="2048"></details><footer>2026/10/28 · NUUPAMO / Moa Lab.</footer></main></body></html>\n`);
    console.log(JSON.stringify({ assets: records.length, deliveryBytes: records.reduce((n, r) => n + r.bytes, 0), photos: 6, mockups: 3, manifest: path.join(out, 'manifest.json') }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
