"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { FlipCard } from "@/components/FlipCard";
import { NeoButton } from "@/components/NeoButton";
import { ResultPoster } from "@/components/ResultPoster";
import { pickWeighted } from "@/lib/random";
import type { DecisionOption, DecisionTemplate } from "@/lib/types";

type Phase = "ready" | "drawing" | "revealed";

/** 反后悔机制微文案（指南 1.1 节） */
const REROLL_HINT = "当你想要重新抽取时，说明你心里已经知道真正想要的答案了";

/**
 * 决策抽取流程编排（指南 4.2 / 4.3 节）
 * 状态机：ready →(点击抽取, 加权随机, 翻转) drawing →(翻转完成) revealed
 * revealed →(再抽一次, 仅一次反悔机会) drawing →(翻回正面再翻回背面) revealed
 * 每次揭晓时触发全屏撒花（canvas-confetti）。
 */
export function DecisionBoard({ template }: { template: DecisionTemplate }) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState<DecisionOption | null>(null);
  const [rerolled, setRerolled] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const confettiedRef = useRef(false);
  const hintTimerRef = useRef<number | null>(null);

  // 卸载时清理提示定时器
  useEffect(() => {
    return () => {
      if (hintTimerRef.current !== null) window.clearTimeout(hintTimerRef.current);
    };
  }, []);

  /** 全屏撒花：Cannon 模式从屏幕中部向上喷射（指南 2.3 节） */
  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 130,
      spread: 75,
      startVelocity: 45,
      origin: { y: 0.6 },
      zIndex: 999,
    });
  }, []);

  /** 翻转动画完成回调：direction 由 flipped 的当前值区分 */
  const handleFlipComplete = useCallback(() => {
    if (flipped && phase === "drawing") {
      // 已翻到背面 → 揭晓结果 + 撒花
      setPhase("revealed");
      if (!confettiedRef.current) {
        confettiedRef.current = true;
        fireConfetti();
      }
    } else if (!flipped && phase === "drawing") {
      // 已翻回正面（重抽路径）→ 立即再次翻向背面展示新结果
      setFlipped(true);
    }
  }, [flipped, phase, fireConfetti]);

  /** 首次抽取 */
  const startDraw = useCallback(() => {
    setResult(pickWeighted(template.options));
    confettiedRef.current = false;
    setPhase("drawing");
    setFlipped(true);
  }, [template]);

  /** 反悔重抽：会话内仅一次机会 */
  const reroll = useCallback(() => {
    if (rerolled || phase !== "revealed") return;
    // 先弹出心理提示，再执行重抽
    setShowHint(true);
    hintTimerRef.current = window.setTimeout(() => setShowHint(false), 2200);
    setResult(pickWeighted(template.options));
    setRerolled(true);
    confettiedRef.current = false;
    setPhase("drawing");
    setFlipped(false);
  }, [rerolled, phase, template]);

  const hintText = result ? `天意如此，就选「${result.text}」！` : null;

  return (
    <div className="flex flex-col">
      {/* 返回首页 */}
      <Link
        href="/"
        className="mb-5 w-fit border-2 border-black bg-paper px-3 py-1 text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
      >
        ← 返回
      </Link>

      {/* 模板标题区 */}
      <header className="mb-6 text-center">
        <span className="text-4xl" aria-hidden="true">
          {template.emoji}
        </span>
        <h1 className="mt-2 text-2xl font-black">{template.title}</h1>
        <p className="mt-1 text-xs font-semibold opacity-70">
          {template.options.length} 个选项 · 权重随机 · 一次反悔机会
        </p>
      </header>

      {/* 翻牌卡片区 */}
      <div className="mx-auto w-full max-w-[300px]">
        <FlipCard
          flipped={flipped}
          onFlipComplete={handleFlipComplete}
          front={
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 border-2 border-black bg-neon-green p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-6xl" aria-hidden="true">
                ❓
              </span>
              <p className="text-sm font-black leading-relaxed">
                答案藏在背面
                <br />
                点下方按钮，交给天意
              </p>
            </div>
          }
          back={
            result ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 border-2 border-black bg-neon-pink p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  天意已定
                </span>
                <p className="break-words text-3xl font-black leading-tight">
                  {result.text}
                </p>
                {hintText && <p className="text-xs font-bold opacity-90">{hintText}</p>}
              </div>
            ) : null
          }
        />
      </div>

      {/* 反悔提示横幅（AnimatePresence 进出场动画） */}
      <div className="mt-4 min-h-[44px]">
        <AnimatePresence>
          {showHint && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="border-2 border-black bg-neon-yellow px-3 py-2 text-center text-xs font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              {REROLL_HINT}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* 操作按钮区 */}
      <div className="mt-4 flex flex-col items-center gap-2">
        {phase === "ready" && (
          <NeoButton onClick={startDraw} className="w-full">
            开始抽取
          </NeoButton>
        )}
        {phase === "drawing" && (
          <NeoButton disabled className="w-full">
            天意运转中…
          </NeoButton>
        )}
        {phase === "revealed" && !rerolled && (
          <NeoButton onClick={reroll} className="w-full bg-neon-cyan">
            再抽一次（仅此一次反悔机会）
          </NeoButton>
        )}
        {phase === "revealed" && rerolled && (
          <NeoButton disabled className="w-full">
            命运已定，接受天意
          </NeoButton>
        )}
      </div>

      {/* 结果海报区：生成分享图（指南 1.3 节社交传播闭环） */}
      {phase === "revealed" && result && (
        <section className="mt-6" aria-label="结果海报">
          <h3 className="mb-3 text-center text-xs font-black uppercase tracking-widest">
            ⬇ 分享你的决策
          </h3>
          <ResultPoster template={template} result={result} />
        </section>
      )}
    </div>
  );
}
