"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  /** true = 翻到背面（展示结果），false = 翻回正面 */
  flipped: boolean;
  /** 单次翻转动画完成时回调（0↔180 两个方向都会触发） */
  onFlipComplete?: () => void;
  className?: string;
}

/**
 * 3D 翻牌卡片（指南 2.3 节）
 * 父容器设置 perspective 视距，卡片自身 preserve-3d；
 * 正面背面分别 backface-visibility: hidden，背面预旋转 180°；
 * 通过 rotateY 0↔180 切换，0.6s ease-out 还原物理翻转手感。
 */
export function FlipCard({ front, back, flipped, onFlipComplete, className }: FlipCardProps) {
  return (
    <div className={cn("relative aspect-[3/4] w-full [perspective:1200px]", className)}>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        onAnimationComplete={onFlipComplete}
      >
        {/* 正面 */}
        <div className="absolute inset-0 [backface-visibility:hidden]">{front}</div>
        {/* 背面：预旋转 180°，父容器转到 180° 时正对用户 */}
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
