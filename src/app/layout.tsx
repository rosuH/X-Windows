import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "X-Windows",
  description: "X 风格帖子里的迷你 IDE 体验",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
