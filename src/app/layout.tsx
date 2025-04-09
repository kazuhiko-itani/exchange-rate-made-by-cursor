import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ドル円為替レート | 過去1年間の推移",
  description:
    "過去1年間のドル円為替レートを日別で表示するウェブアプリケーション",
  keywords: "為替レート, ドル円, 為替チャート, USD/JPY, 日本円, 米ドル",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
