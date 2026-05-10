import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "회의록 요약기",
  description: "회의록을 붙여넣으면 GPT가 요약해주는 도구",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
