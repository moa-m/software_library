import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "通知にメモ。 | とにかく手軽にメモしたいあなたへ。",
  description:
    "思い出した瞬間を通知領域に残せるメモアプリ『通知にメモ。』の紹介ページ。とにかく手軽に、忘れる前にメモできます。",
};

export const viewport: Viewport = {
  themeColor: "#FFDE59",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja" className="scroll-smooth">
      <body id="top" className={`${notoSansJp.className} text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
