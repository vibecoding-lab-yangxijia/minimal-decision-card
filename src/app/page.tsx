"use client";

import { useState } from "react";
import { NeoCard } from "@/components/NeoCard";
import { SceneCard } from "@/components/SceneCard";
import {
  TemplateEditorDrawer,
  type EditorTarget,
} from "@/components/TemplateEditorDrawer";
import { useHydratedTemplates, useTemplateStore } from "@/store/templateStore";

/**
 * 首页 · 移动端 App 容器
 * 目标：打开网页 → 3 秒内看到可点击的决策场景，直达主题（指南 2.2 节）。
 * 模板列表来自 Zustand store（localStorage 持久化）；卡片右上角 ✎ 打开编辑抽屉，
 * 「＋ 新建问题」创建自定义决策。
 */
export default function HomePage() {
  const templates = useTemplateStore((s) => s.templates);
  const hydrated = useHydratedTemplates();
  const [editor, setEditor] = useState<EditorTarget | null>(null);

  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center px-4 py-6 sm:py-10">
      {/* 居中卡片容器：max-w-md 限定手机宽度，两端留白 */}
      <div className="w-full max-w-md">
        {/* 顶部标题区 */}
        <header className="mb-8 text-center">
          <p className="mb-3 inline-block border-2 border-black bg-neon-yellow px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            3 秒 · 告别纠结
          </p>
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            拯救
            <span className="bg-neon-pink px-2 text-paper">选择困难症</span>
          </h1>
          <p className="mt-3 text-sm font-semibold">不知道选什么？把决定权交给天意。</p>
        </header>

        {/* 场景入口卡片区 */}
        <section aria-label="决策场景">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest">
            今天要决定什么？
          </h2>
          {!hydrated ? (
            <p className="border-2 border-dashed border-black bg-paper py-10 text-center text-sm font-bold opacity-70">
              加载中…
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <SceneCard
                  key={template.id}
                  template={template}
                  onEdit={() => setEditor({ mode: "edit", id: template.id })}
                />
              ))}
              {/* 新建自定义问题入口 */}
              <button
                type="button"
                onClick={() => setEditor({ mode: "create" })}
                aria-label="新建自定义问题"
                className="flex flex-col items-start gap-1 border-2 border-dashed border-black bg-paper p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <span className="text-3xl" aria-hidden="true">
                  ＋
                </span>
                <span className="text-lg font-black">新建问题</span>
                <span className="text-xs font-semibold opacity-80">
                  自己写一个想决定的事
                </span>
              </button>
            </div>
          )}
          <p className="mt-3 text-center text-[10px] font-semibold opacity-60">
            卡片右上角 ✎ 可自定义选项与权重 · 新建问题会保存在本地
          </p>
        </section>

        {/* 底部品牌区：安全区适配（刘海屏底部留白） */}
        <footer className="mt-10 border-t-2 border-dashed border-black pt-4 text-center">
          <NeoCard className="px-3 py-2">
            <p className="text-xs font-bold leading-relaxed">
              每次只给 2–6 个选项 · 帮你从「最大化者」变成「满足者」
            </p>
          </NeoCard>
          <p className="mt-4 pb-safe text-[10px] font-semibold opacity-60">
            极简决策卡 · 拯救选择困难症
          </p>
        </footer>
      </div>

      {/* 模板编辑抽屉 */}
      <TemplateEditorDrawer editor={editor} onClose={() => setEditor(null)} />
    </main>
  );
}
