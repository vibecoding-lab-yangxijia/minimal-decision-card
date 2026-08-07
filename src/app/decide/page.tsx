"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DecisionBoard } from "@/components/DecisionBoard";
import { useHydratedTemplates, useTemplateStore } from "@/store/templateStore";

/**
 * 决策页内容：/decide?t=<templateId>
 * 模板从 Zustand store 读取（用户自定义后立即生效）；无效 id 回退第一个模板。
 */
function DecideContent() {
  const searchParams = useSearchParams();
  const templates = useTemplateStore((s) => s.templates);
  const hydrated = useHydratedTemplates();

  // 本地数据水合完成前显示占位，避免自定义模板闪现为预设模板
  if (!hydrated) {
    return <p className="text-center text-sm font-bold">加载中…</p>;
  }

  const id = searchParams.get("t");
  const template = templates.find((t) => t.id === id) ?? templates[0];

  if (!template) {
    return <p className="text-center text-sm font-bold">暂无可用模板</p>;
  }

  return <DecisionBoard template={template} />;
}

export default function DecidePage() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* useSearchParams 需要 Suspense 边界（Next.js App Router 要求） */}
        <Suspense fallback={<p className="text-center text-sm font-bold">加载中…</p>}>
          <DecideContent />
        </Suspense>
      </div>
    </main>
  );
}
