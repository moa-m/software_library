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
              <a
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
              </a>
              <a
                href="mailto:info@moa-lab.com"
                aria-label="お問い合わせ"
              >
                <img
                  src="/images/icon/mail.png"
                  alt="Mail icon"
                  className="social-icon mail-icon"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="project-links">
          <a href="privacy_policy.html">プライバシーポリシー</a>
        </div>
        <p className="footer-text">
          Copyright © 2025 @Moa Lab. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
