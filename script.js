// ページ読み込み時のローディングアニメーション
window.addEventListener('load', () => {
    document.querySelector('.loader').style.display = 'none';
});

// スムーズスクロール
document.querySelector('.btn-primary').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#apps').scrollIntoView({ behavior: 'smooth' });
});

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

// テーマ切り替え
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// 検索機能
document.querySelector('.search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
});

// ライトボックスの機能
const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
const lightboxOverlay = document.getElementById('lightbox-overlay');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxDisclaimer = document.getElementById('lightbox-disclaimer');

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

    let currentImageIndex = 0;
    const images = Array.from(lightboxTriggers).map(trigger => trigger.href);

    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            currentImageIndex = images.indexOf(this.href);
            lightboxImage.src = this.href;
            lightboxDisclaimer.innerHTML = disclaimerHTML;
            lightboxOverlay.style.display = 'flex';
            lightboxImage.classList.remove('zoom');
        });
    });

    function closeLightbox() {
        lightboxOverlay.style.display = 'none';
        lightboxDisclaimer.innerHTML = '';
        lightboxImage.classList.remove('zoom');
    }

    // 閉じるボタン
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') closeLightbox();
    });

    // オーバーレイのクリック
    lightboxOverlay.addEventListener('click', function(event) {
        if (event.target === lightboxOverlay) {
            closeLightbox();
        }
    });

    // 画像のズーム
    lightboxImage.addEventListener('click', () => {
        lightboxImage.classList.toggle('zoom');
    });

    // カルーセル機能
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.classList.remove('zoom');
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.classList.remove('zoom');
    }

    document.addEventListener('keydown', (e) => {
        if (lightboxOverlay.style.display === 'flex') {
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeLightbox();
        }
    });
}

// 画像の右クリック禁止
function preventImageContextMenu(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        const targetImages = el.tagName === 'IMG' ? [el] : el.querySelectorAll('img');
        targetImages.forEach(img => {
            img.addEventListener('contextmenu', function(event) {
                event.preventDefault();
            });
        });
    });
}

preventImageContextMenu('.lightbox-trigger');
if (lightboxImage) {
    lightboxImage.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}