// ページ読み込み時のローディングアニメーション
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        // ローダーが消える前に少し待機して滑らかな遷移を確保
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }
});

// スムーズスクロール
const checkButton = document.querySelector('.btn-primary');
if (checkButton) {
    checkButton.addEventListener('click', (e) => {
        e.preventDefault();
        const appsSection = document.querySelector('#apps');
        if (appsSection) {
            appsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// スクロール時のフェードインアニメーション
const fadeInElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // ポップアニメーションを追加
            entry.target.classList.add('pop-element');
        }
    });
}, { threshold: 0.1 });

fadeInElements.forEach(el => observer.observe(el));

// ヘッダースクロール効果
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// カードホバーエフェクトの強化
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.03)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    });
});

// ボタンクリック時のフィードバック
const buttons = document.querySelectorAll('button, .btn-primary, .link-primary');
buttons.forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
    });
});

// シャイニーエフェクトの追加
const shinyElements = document.querySelectorAll('.shiny-effect');
shinyElements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', `${x}px`);
        element.style.setProperty('--mouse-y', `${y}px`);
    });
});