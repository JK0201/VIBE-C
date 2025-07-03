import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vibe-C",
  description: "개발자와 클라이언트를 연결하는 P2P 개발 모듈 거래 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
