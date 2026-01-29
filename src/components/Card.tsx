import { useEffect, useRef } from 'react';
import { useFadeIn } from '../hooks/useFadeIn'; // useFadeInフックをインポート

// propsの型定義
interface CardProps {
  imgSrc: string;
  imgAlt: string;
  title: React.ReactNode; // HTML要素を含む可能性があるため
  text: React.ReactNode; // HTML要素を含む可能性があるため
  link: string;
  linkText: string;
  isSticker?: boolean; // LINEスタンプカードかどうかを判定するフラグ
  style?: React.CSSProperties; // styleプロパティを追加
}

const Card: React.FC<CardProps> = ({
  imgSrc,
  imgAlt,
  title,
  text,
  link,
  linkText,
  isSticker = false,
  style, // style propを受け取る
}) => {
  const { ref: cardRef, isVisible } = useFadeIn(); // useFadeInフックを使用
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const cardElement = cardRef.current;
    const linkElement = linkRef.current;
    if (!cardElement || !linkElement) return;

    // --- カードホバーエフェクト ---
    const handleMouseEnter = () => {
      cardElement.style.transform = 'translateY(-12px) scale(1.03)';
      cardElement.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    };
    const handleMouseLeave = () => {
      cardElement.style.transform = 'translateY(0) scale(1)';
      cardElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    };

    // --- シャイニーエフェクト ---
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardElement.style.setProperty('--mouse-x', `${x}px`);
      cardElement.style.setProperty('--mouse-y', `${y}px`);
    };

    // --- ボタンクリック時のフィードバック ---
    const handleLinkClick = () => {
      linkElement.classList.add('clicked');
      setTimeout(() => {
        linkElement.classList.remove('clicked');
      }, 300);
    };
    
    // --- イベントリスナーの登録 ---
    cardElement.addEventListener('mouseenter', handleMouseEnter);
    cardElement.addEventListener('mouseleave', handleMouseLeave);
    cardElement.addEventListener('mousemove', handleMouseMove);
    linkElement.addEventListener('click', handleLinkClick);

    // --- クリーンアップ関数 ---
    return () => {
      cardElement.removeEventListener('mouseenter', handleMouseEnter);
      cardElement.removeEventListener('mouseleave', handleMouseLeave);
      cardElement.removeEventListener('mousemove', handleMouseMove);
      linkElement.removeEventListener('click', handleLinkClick);
    };
  }, [cardRef]); // cardRefを依存配列に追加

  return (
    <div ref={cardRef} className={`card hover-scale fade-in shiny-effect ${isVisible ? 'is-visible' : ''}`} style={style}>
      <img
        src={imgSrc}
        alt={imgAlt}
        className={isSticker ? 'sticker-img' : 'card-img'}
      />
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
      <a ref={linkRef} href={link} className="link-primary shiny-effect">
        {linkText}
      </a>
    </div>
  );
};

export default Card;
