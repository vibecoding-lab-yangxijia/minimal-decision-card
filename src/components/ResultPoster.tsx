"use client";

import { useRef, useState } from "react";
import { domToPng } from "modern-screenshot";
import { NeoButton } from "@/components/NeoButton";
import type { DecisionOption, DecisionTemplate } from "@/lib/types";

interface ResultPosterProps {
  template: DecisionTemplate;
  result: DecisionOption;
}

/**
 * 结果海报（指南 1.3 / 4.4 节）
 * 新粗野主义竖版海报：结果大字 + 情绪文案 + 二维码占位 + 品牌标识。
 * 导出使用 modern-screenshot 的 domToPng —— 基于 html-to-image 的修复分支，
 * 规避 html2canvas 的跨域 Canvas 污染与 iOS Safari 绘图队列延迟 Bug（指南 3.3 节）。
 */
export function ResultPoster({ template, result }: ResultPosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hintText = `天意如此，就选「${result.text}」！`;

  const handleSave = async () => {
    const node = posterRef.current;
    if (!node || exporting) return;
    setExporting(true);
    setExported(false);
    setError(null);
    try {
      const dataUrl = await domToPng(node, {
        scale: 2,
        quality: 1,
        backgroundColor: "#ffb700",
      });
      // 触发本地下载
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `决策卡-${template.title}-${result.text}-${Date.now()}.png`;
      link.click();
      setExported(true);
      window.setTimeout(() => setExported(false), 2000);
    } catch (err) {
      console.error("海报导出失败:", err);
      setError("海报生成失败，请重试");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 海报 DOM（导出目标） */}
      <div
        ref={posterRef}
        className="aspect-[3/4] w-full overflow-hidden border-2 border-black bg-neon-yellow shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex h-full w-full flex-col items-center justify-between px-6 py-8 text-center">
          {/* 顶部：模板标识 */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-70">
              {template.emoji} {template.title}
            </p>
            <p className="mt-2 text-2xl font-black">天意已定</p>
          </div>

          {/* 中部：结果大字 + 情绪文案 */}
          <div>
            <p className="break-words text-4xl font-black leading-tight sm:text-5xl">
              {result.text}
            </p>
            <p className="mt-3 text-sm font-bold">{hintText}</p>
          </div>

          {/* 底部：二维码占位 + 品牌区 */}
          <div>
            <QrPlaceholder />
            <p className="mt-2 text-[10px] font-bold opacity-70">
              扫码下载 · 拯救选择困难症
            </p>
            <p className="mt-4 inline-block border-2 border-black bg-black px-2 py-0.5 text-[10px] font-black text-paper">
              极简决策卡
            </p>
          </div>
        </div>
      </div>

      {/* 导出按钮：loading 防抖 + 成功反馈（指南 4.4 节 UX 优化） */}
      <NeoButton
        onClick={handleSave}
        disabled={exporting}
        className="w-full bg-neon-cyan"
      >
        {exporting ? "生成中…" : exported ? "已保存 ✓" : "保存为图片"}
      </NeoButton>
      {error && <p className="text-xs font-black text-neon-pink">{error}</p>}
    </div>
  );
}

/** 伪二维码占位（报告 1.3 节：海报底部预留二维码引流位） */
function QrPlaceholder() {
  return (
    <svg
      viewBox="0 0 21 21"
      className="mx-auto h-16 w-16 border-2 border-black bg-white"
      role="img"
      aria-label="二维码占位"
    >
      {/* 定位角 */}
      <g fill="#000">
        <rect x="1" y="1" width="5" height="5" />
        <rect x="1" y="15" width="5" height="5" />
        <rect x="15" y="1" width="5" height="5" />
      </g>
      {/* 固定伪随机数据块 */}
      <g fill="#000">
        <rect x="7" y="1" width="2" height="2" />
        <rect x="10" y="1" width="2" height="2" />
        <rect x="7" y="4" width="2" height="2" />
        <rect x="13" y="4" width="2" height="2" />
        <rect x="16" y="4" width="2" height="2" />
        <rect x="1" y="7" width="2" height="2" />
        <rect x="4" y="7" width="2" height="2" />
        <rect x="7" y="7" width="2" height="2" />
        <rect x="10" y="7" width="2" height="2" />
        <rect x="13" y="7" width="2" height="2" />
        <rect x="16" y="7" width="2" height="2" />
        <rect x="1" y="10" width="2" height="2" />
        <rect x="4" y="10" width="2" height="2" />
        <rect x="10" y="10" width="2" height="2" />
        <rect x="13" y="10" width="2" height="2" />
        <rect x="16" y="10" width="2" height="2" />
        <rect x="7" y="13" width="2" height="2" />
        <rect x="10" y="13" width="2" height="2" />
        <rect x="1" y="16" width="2" height="2" />
        <rect x="4" y="16" width="2" height="2" />
        <rect x="7" y="16" width="2" height="2" />
        <rect x="13" y="16" width="2" height="2" />
        <rect x="16" y="16" width="2" height="2" />
      </g>
    </svg>
  );
}
