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