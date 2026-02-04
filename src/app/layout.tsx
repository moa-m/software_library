import type { Metadata } from 'next';
import '@/App.css';

export const metadata: Metadata = {
  title: 'moa_M Studio & LINE Stickers',
  description: 'moa_M Studio and LINE Stickers collection',
  icons: {
    icon: '/images/icon/icon.png',
  },
  alternates: {
    canonical: 'https://moa-software-library.pages.dev/',
  },
  other: {
    'google-site-verification': 'pv8pcPgAHm5B_ZAz355ZdWpknLzQXXWzLaePnXYYqf0',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark text-white font-inter">
        {children}
      </body>
    </html>
  );
}