import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { useFadeIn } from '@/hooks/useFadeIn';
import './Card.css';

interface CardProps {
  imgSrc: string;
  imgAlt: string;
  title: ReactNode;
  text: ReactNode;
  link: string;
  linkText: string;
  isSticker?: boolean;
  style?: CSSProperties;
}

const Card = ({
  imgSrc,
  imgAlt,
  title,
  text,
  link,
  linkText,
  isSticker = false,
  style,
}: CardProps) => {
  const { ref: cardRef, isVisible } = useFadeIn();

  return (
    <article
      ref={cardRef}
      className={`card fade-in ${isVisible ? 'is-visible' : ''}`}
      style={style}
    >
      <img
        src={imgSrc}
        alt={imgAlt}
        className={isSticker ? 'sticker-img' : 'card-img'}
      />
      <h3 className="card-title">{title}</h3>
      <p className="card-text">{text}</p>
      <Link href={link} className="link-primary" target="_blank" rel="noopener noreferrer">
        {linkText}
      </Link>
    </article>
  );
};

export default Card;
