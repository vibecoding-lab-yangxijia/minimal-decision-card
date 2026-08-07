"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NeoButton } from "@/components/NeoButton";
import { useTemplateStore } from "@/store/templateStore";
import { genId } from "@/lib/id";
import type { DecisionOption } from "@/lib/types";

/** 报告 1.1 节：每次决策备选项 2–6 个，避免认知过载 */
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 6;
const MAX_WEIGHT = 5;
const MAX_TITLE_LENGTH = 30;

/** 抽屉的编辑目标：新建自定义问题 / 编辑既有模板 */
export type EditorTarget = { mode: "create" } | { mode: "edit"; id: string };

interface TemplateEditorDrawerProps {
  editor: EditorTarget | null;
  onClose: () => void;
}

/**
 * 模板编辑抽屉（指南 1.1 节「权重设置」功能）
 * 底部滑出，支持：
 * - 新建模式：填写问题标题 + 选项，保存后成为自定义模板
 * - 编辑模式：修改标题、增删选项、调整权重（0–5）
 * - 自定义模板可删除（预设模板不可）
 * 本地草稿编辑、保存时提交 store。
 */
export function TemplateEditorDrawer({ editor, onClose }: TemplateEditorDrawerProps) {
  const open = editor !== null;
  const isCreate = editor?.mode === "create";
  // getTemplate 必须无条件调用（hooks 规则），条件判断放在取值阶段
  const getTemplate = useTemplateStore((s) => s.getTemplate);
  const template = editor?.mode === "edit" ? getTemplate(editor.id) : undefined;

  const updateOptions = useTemplateStore((s) => s.updateOptions);
  const updateTitle = useTemplateStore((s) => s.updateTitle);
  const addTemplate = useTemplateStore((s) => s.addTemplate);
  const removeTemplate = useTemplateStore((s) => s.removeTemplate);

  const [draftTitle, setDraftTitle] = useState("");
  const [draft, setDraft] = useState<DecisionOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 打开抽屉时用当前目标初始化草稿（深拷贝）；新建模式给两个空选项
  useEffect(() => {
    if (!open) return;
    if (isCreate) {
      setDraftTitle("");
      setDraft([
        { id: genId("opt"), text: "", weight: 1 },
        { id: genId("opt"), text: "", weight: 1 },
      ]);
    } else if (template) {
      setDraftTitle(template.title);
      setDraft(template.options.map((o) => ({ ...o })));
    }
    setError(null);
  }, [open, isCreate, template]);

  // 打开时锁定背景滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleAdd = () => {
    setError(null);
    setDraft((d) =>
      d.length >= MAX_OPTIONS ? d : [...d, { id: genId("opt"), text: "", weight: 1 }]
    );
  };

  const handleRemove = (id: string) => {
    if (draft.length <= MIN_OPTIONS) {
      setError(`至少保留 ${MIN_OPTIONS} 个选项`);
      return;
    }
    setError(null);
    setDraft((d) => d.filter((o) => o.id !== id));
  };

  const handleText = (id: string, text: string) => {
    setDraft((d) => d.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const adjustWeight = (id: string, delta: number) => {
    setDraft((d) =>
      d.map((o) =>
        o.id === id
          ? { ...o, weight: Math.min(MAX_WEIGHT, Math.max(0, o.weight + delta)) }
          : o
      )
    );
  };

  const handleSave = () => {
    const title = draftTitle.trim();
    if (!title) {
      setError("请先填写问题标题");
      return;
    }
    const cleaned = draft
      .map((o) => ({ ...o, text: o.text.trim() }))
      .filter((o) => o.text.length > 0);
    if (cleaned.length < MIN_OPTIONS) {
      setError(`至少保留 ${MIN_OPTIONS} 个有文字的选项`);
      return;
    }
    if (isCreate) {
      addTemplate({ title, options: cleaned });
    } else if (template) {
      updateOptions(template.id, cleaned);
      if (title !== template.title) updateTitle(template.id, title);
    }
    onClose();
  };

  const handleDelete = () => {
    if (!template?.custom || editor?.mode !== "edit") return;
    if (window.confirm(`确定删除「${template.title}」吗？此操作不可撤销。`)) {
      removeTemplate(template.id);
      onClose();
    }
  };

  const canDelete = editor?.mode === "edit" && !!template?.custom;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 遮罩 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          {/* 底部抽屉 */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={isCreate ? "新建问题" : `编辑「${template?.title ?? ""}」`}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] w-full max-w-md overflow-y-auto border-t-4 border-black bg-paper"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between border-b-2 border-black px-4 py-3">
              <h2 className="text-base font-black">
                {isCreate ? "＋ 新建问题" : `${template?.emoji ?? "❓"} 编辑「${template?.title ?? ""}」`}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭"
                className="border-2 border-black bg-neon-pink px-2 py-0.5 text-xs font-black text-paper shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ✕
              </button>
            </div>

            {/* 问题标题输入 */}
            <div className="border-b-2 border-dashed border-black px-4 py-3">
              <label
                htmlFor="template-title"
                className="mb-1 block text-[11px] font-black opacity-60"
              >
                问题标题
              </label>
              <input
                id="template-title"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="输入你的问题，例如：要不要去这个地方？"
                maxLength={MAX_TITLE_LENGTH}
                className="w-full border-2 border-black bg-white px-2 py-2 text-sm font-bold outline-none placeholder:font-normal placeholder:opacity-40 transition-all duration-150 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px]"
              />
            </div>

            {/* 使用说明 */}
            <p className="border-b-2 border-dashed border-black px-4 py-2 text-[11px] font-bold opacity-70">
              权重越高越容易被抽中；权重 0 = 不参与抽取。每次决策 2–6 个选项。
            </p>

            {/* 选项列表 */}
            <ul className="flex flex-col gap-3 px-4 py-4">
              {draft.map((option, index) => (
                <li key={option.id} className="flex items-center gap-2">
                  <span className="w-5 shrink-0 text-center text-xs font-black opacity-60">
                    {index + 1}
                  </span>
                  <input
                    value={option.text}
                    onChange={(e) => handleText(option.id, e.target.value)}
                    placeholder={`选项 ${index + 1}`}
                    maxLength={20}
                    className="min-w-0 flex-1 border-2 border-black bg-white px-2 py-2 text-sm font-semibold outline-none placeholder:font-normal placeholder:opacity-40 transition-all duration-150 focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px]"
                  />
                  {/* 权重控件 − / 值 / + */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => adjustWeight(option.id, -1)}
                      disabled={option.weight <= 0}
                      aria-label={`降低权重（当前 ${option.weight}）`}
                      className="h-8 w-7 border-2 border-black bg-neon-yellow text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-sm font-black" title="权重">
                      {option.weight}
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustWeight(option.id, 1)}
                      disabled={option.weight >= MAX_WEIGHT}
                      aria-label={`提高权重（当前 ${option.weight}）`}
                      className="h-8 w-7 border-2 border-black bg-neon-green text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:pointer-events-none disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(option.id)}
                    aria-label={`删除选项「${option.text || index + 1}」`}
                    className="h-8 w-7 shrink-0 border-2 border-black bg-neon-pink text-sm font-black text-paper shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>

            {/* 添加选项 */}
            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={handleAdd}
                disabled={draft.length >= MAX_OPTIONS}
                className="w-full border-2 border-dashed border-black bg-paper px-3 py-2 text-sm font-black opacity-80 transition-all duration-150 ease-out hover:opacity-100 active:translate-x-[2px] active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-30"
              >
                + 添加选项（{draft.length}/{MAX_OPTIONS}）
              </button>
            </div>

            {/* 错误提示 */}
            {error && <p className="px-4 pb-3 text-xs font-black text-neon-pink">{error}</p>}

            {/* 底部操作 */}
            <div className="flex gap-3 border-t-2 border-black bg-paper px-4 py-4 pb-safe">
              {canDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="shrink-0 border-2 border-black bg-neon-pink px-3 py-2 text-sm font-black text-paper shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-out active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                  删除
                </button>
              )}
              <NeoButton onClick={onClose} className="flex-1">
                取消
              </NeoButton>
              <NeoButton onClick={handleSave} className="flex-1 bg-neon-green">
                保存
              </NeoButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
