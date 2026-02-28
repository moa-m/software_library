import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img
            src="/images/icon/icon.png"
            alt="moa プロフィール画像"
            className="profile-image"
          />
          <div>
            <p className="profile-name">Moa Lab</p>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/privacy-policy">プライバシーポリシー</Link>
        </nav>

        <div className="profile-contact-icons">
          <Link
            href="https://x.com/moa_lab"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="moa on X"
          >
            <img
              src="/images/icon/x_logo-white.png"
              alt="X logo"
              className="social-icon x-logo-icon"
            />
          </Link>
          <Link href="mailto:info@moa-lab.com" aria-label="お問い合わせ">
            <img
              src="/images/icon/mail.png"
              alt="Mail icon"
              className="social-icon mail-icon"
            />
          </Link>
        </div>

        <p className="footer-text">Copyright © 2026 @Moa Lab. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
