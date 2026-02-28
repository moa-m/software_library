'use client';

import Link from 'next/link';
import { useFadeInSelector } from '@/hooks/useFadeInSelector';
import '@/app/privacy-policy/PrivacyPolicy.css';

export default function PrivacyPolicy() {
  useFadeInSelector('.fade-in');

  return (
    <div className="privacy-policy-page">
      <section className="section">
        <div className="container privacy-container">
          <h1 className="section-title fade-in">プライバシーポリシー</h1>

          <div style={{ animationDelay: '0.1s' }} className="fade-in">
            <h2>1. はじめに</h2>
            <p>
              本サイト・アプリは、利用者のプライバシーを尊重し、個人情報の保護に努めます。<br />
              このプライバシーポリシーは、利用者の個人情報をどのように取り扱うかについて定めるものです。
            </p>
          </div>

          <div style={{ animationDelay: '0.2s' }} className="fade-in">
            <h2>2. 収集する情報</h2>
            <p>
              本アプリが個人情報を取得することはありません。<br />
              本アプリが個人情報を利用することはありません。<br />
              本アプリが個人情報を第三者へ提供することはありません。
            </p>
          </div>

          <div style={{ animationDelay: '0.3s' }} className="fade-in">
            <h2>3. 情報の保護</h2>
            <p>
              利用者が入力した情報は、暗号化された状態で端末内に保存され、<br />
              利用者の同意なしに外部に送信されることはありません。
            </p>
          </div>

          <div style={{ animationDelay: '0.4s' }} className="fade-in">
            <h2>4. 要求される権限</h2>
            <p>
              本アプリは利用者が許可した権限のみを使用し、<br />
              それ以外の権限は使用しません。<br />
              また、それ以外の一切の個人情報は収集・利用されません。
            </p>
          </div>

          <div style={{ animationDelay: '0.5s' }} className="fade-in">
            <h2>5. お問い合わせ</h2>
            <p>
              プライバシーポリシーに関するご質問は、以下までご連絡ください：<br />
              <Link href="mailto:info@moa-lab.com">info@moa-lab.com</Link>
            </p>
          </div>
        </div>
      </section>

      <footer className="policy-footer fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="container policy-footer-inner">
          <div className="policy-footer-links">
            <Link href="/" className="btn-back">
              トップページに戻る
            </Link>
          </div>
          <p className="policy-footer-text">© 2026 Moa Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
