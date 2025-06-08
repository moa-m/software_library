// ページ読み込み時のローディングアニメーション
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.style.display = 'none';
});

// スムーズスクロール
const checkButton = document.querySelector('.btn-primary');
if (checkButton) {
    checkButton.addEventListener('click', (e) => {
        e.preventDefault();
        const appsSection = document.querySelector('#apps');
        if (appsSection) {
            appsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

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
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });
}