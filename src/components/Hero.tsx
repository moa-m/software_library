import { useRef, useEffect } from 'react';

const Hero = () => {
  const checkButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const checkButton = checkButtonRef.current;
    if (!checkButton) return;

    // --- スムーズスクロール ---
    const handleScrollClick = (e: MouseEvent) => {
      e.preventDefault();
      const appsSection = document.querySelector('#apps');
      if (appsSection) {
        appsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    };

    // --- ボタンクリック時のフィードバック ---
    const handleButtonClick = () => {
      checkButton.classList.add('clicked');
      setTimeout(() => {
        checkButton.classList.remove('clicked');
      }, 300);
    };

    const handleClick = (e: MouseEvent) => {
      handleScrollClick(e);
      handleButtonClick();
    };

    checkButton.addEventListener('click', handleClick);

    // --- クリーンアップ関数 ---
    return () => {
      checkButton.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <section className="hero-section">
      <div className="text-center px-4">
        <h1 className="hero-title pop-element shiny-effect">Moa Lab.</h1>
        <p className="hero-subtitle pop-element">
          アプリとスタンプで、あなたの毎日に彩りを。
        </p>
        <a
          ref={checkButtonRef}
          href="#apps"
          className="btn-primary pop-element shiny-effect"
        >
          Check Our Products
        </a>
      </div>
    </section>
  );
};

export default Hero;
