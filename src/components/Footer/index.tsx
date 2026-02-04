import Link from 'next/link';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <div className="profile-section-footer">
          <img
            src="/images/icon/icon.png"
            alt="moa プロフィール画像"
            className="profile-image"
          />
          <div className="profile-text-content">
            <span className="profile-name">Moa Lab</span>
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
              <Link
                href="mailto:info@moa-lab.com"
                aria-label="お問い合わせ"
              >
                <img
                  src="/images/icon/mail.png"
                  alt="Mail icon"
                  className="social-icon mail-icon"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="project-links">
          <Link href="/privacy-policy">プライバシーポリシー</Link>
        </div>
        <p className="footer-text">
          Copyright © 2026 @Moa Lab. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;