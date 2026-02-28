import Link from 'next/link';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="container hero-layout">
        <div className="hero-copy">
          <h1 className="hero-title fade-in pop-element">Moa Lab.</h1>
          <p className="hero-subtitle fade-in">
            アプリとスタンプで、あなたの毎日に彩りを。
          </p>
          <div className="hero-actions fade-in">
            <Link href="#apps" className="btn-primary">
              Check Our Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
