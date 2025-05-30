// スクロール時のフェードインアニメーション
const fadeInElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(el => observer.observe(el));

// ライトボックスの機能
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxDisclaimer = document.getElementById('lightbox-disclaimer'); // 注意文言表示用の要素

if (lightboxOverlay && lightboxImage && lightboxClose && lightboxDisclaimer) {
    const disclaimerHTML = `
        <p style="margin-bottom: 0.4em">
            この画像のAI学習による使用は禁止されています。<br />
            AI LEARNING USE OF THIS IMAGE IS PROHIBITED.
        </p>
        <p style="margin-bottom: 0.4em">
            許可なく画像を使用しないでください。<br />
            DO NOT USE IMAGE WITHOUT PERMISSION.
        </p>
        <p style="margin-bottom: 0">
            この画像を印刷または販売することは禁止されています。<br />
            PRINT OR SELL THIS IMAGE IS PROHIBITED.
        </p>
    `;

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault(); // リンクのデフォルト動作をキャンセル
            const imageUrl = this.href;
            lightboxImage.src = imageUrl;
            lightboxDisclaimer.innerHTML = disclaimerHTML; // 注意文言をセット
            lightboxOverlay.style.display = 'flex'; // オーバーレイを表示
        });
    });

    function closeLightbox() {
        lightboxOverlay.style.display = 'none';
        lightboxDisclaimer.innerHTML = ''; // 注意文言をクリア
    }

    // 閉じるボタンでライトボックスを閉じる
    lightboxClose.addEventListener('click', function() {
        closeLightbox();
    });

    // オーバーレイのクリックでライトボックスを閉じる
    lightboxOverlay.addEventListener('click', function(event) {
        if (event.target === lightboxOverlay) { // 画像自体ではなくオーバーレイがクリックされた場合
            closeLightbox();
        }
    });
}

// 画像の右クリックを禁止する
function preventImageContextMenu(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        // img要素自体、またはその子要素のimgに適用
        const targetImages = el.tagName === 'IMG' ? [el] : el.querySelectorAll('img');
        targetImages.forEach(img => {
            img.addEventListener('contextmenu', function(event) {
                event.preventDefault();
            });
        });
    });
}

// カード内の画像トリガーとライトボックス内の画像に適用
preventImageContextMenu('.lightbox-trigger'); // .lightbox-trigger 内の img を対象
if (lightboxImage) { // lightboxImage は単一の img 要素
    lightboxImage.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}