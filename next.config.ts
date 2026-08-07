import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 纯客户端 SPA,静态导出:next build 产物输出到 out/,供 Capacitor 打包为原生 App
  output: "export",
};

export default nextConfig;
