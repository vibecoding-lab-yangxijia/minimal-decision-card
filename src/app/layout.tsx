import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "极简决策卡 · 拯救选择困难症",
  description:
    "面向选择困难症的极简决策互动应用：盲盒抽取、大转盘、卡片翻转，把决定权交给天意。",
  applicationName: "极简决策卡",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "极简决策卡",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* 允许内容延伸到刘海屏安全区之外，配合 safe-area utilities 使用 */
  viewportFit: "cover",
  themeColor: "#f7f3e8",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="font-display">{children}</body>
    </html>
  );
}
