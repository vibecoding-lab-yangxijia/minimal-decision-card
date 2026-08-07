import Link from "next/link";
import { NeoCard } from "@/components/NeoCard";
import type { DecisionTemplate, SceneTone } from "@/lib/types";

const TONE_BG: Record<SceneTone, string> = {
  pink: "bg-neon-pink",
  green: "bg-neon-green",
  yellow: "bg-neon-yellow",
  cyan: "bg-neon-cyan",
};

interface SceneCardProps {
  template: DecisionTemplate;
  /** 打开该模板的编辑抽屉 */
  onEdit: () => void;
}

/**
 * 场景入口卡片：主体点击跳转决策页（/decide?t=<id>），
 * 右上角 ✎ 编辑按钮独立于链接，打开模板编辑抽屉。
 */
export function SceneCard({ template, onEdit }: SceneCardProps) {
  return (
    <div className="relative">
      <NeoCard
        as={Link}
        href={`/decide?t=${template.id}`}
        className={`${TONE_BG[template.tone]} flex flex-col items-start gap-1 p-4 text-left no-underline`}
      >
        <span className="text-3xl" aria-hidden="true">
          {template.emoji}
        </span>
        <span className="pr-6 text-lg font-black">{template.title}</span>
        <span className="text-xs font-semibold opacity-80">{template.tagline}</span>
      </NeoCard>

      <button
        type="button"
        onClick={onEdit}
        aria-label={`编辑「${template.title}」选项`}
        className="absolute right-2 top-2 z-10 flex items-center gap-0.5 border-2 border-black bg-paper px-1.5 py-0.5 text-[10px] font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
      >
        ✎ 编辑
      </button>
    </div>
  );
}
