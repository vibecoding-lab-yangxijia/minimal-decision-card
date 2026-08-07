import { create } from "zustand";
import { useEffect } from "react";
import { templates as presetTemplates } from "@/lib/templates";
import { genId } from "@/lib/id";
import type { DecisionOption, DecisionTemplate, SceneTone } from "@/lib/types";

/**
 * 模板库全局状态（指南 4.2 节）
 * 预置 4 个预设模板；支持用户新建自定义模板（custom）、修改标题 / 选项与权重、
 * 删除自定义模板。所有改动通过 localStorage 持久化，刷新不丢失。
 *
 * 水合策略：服务端渲染与客户端首帧均保持 hasHydrated = false（渲染「加载中」占位），
 * 由 useHydratedTemplates 在组件挂载后从 localStorage 恢复用户数据，避免 hydration mismatch。
 */
const STORAGE_KEY = "decision-card-templates:v1";

/** 新建模板的 tone 按创建顺序轮换，避免全是同一种颜色 */
const CUSTOM_TONES: SceneTone[] = ["cyan", "pink", "yellow", "green"];

interface TemplateStore {
  templates: DecisionTemplate[];
  /** 是否已完成本地持久化数据的水合 */
  hasHydrated: boolean;
  updateOptions: (templateId: string, options: DecisionOption[]) => void;
  updateTitle: (templateId: string, title: string) => void;
  addTemplate: (input: { title: string; options: DecisionOption[] }) => void;
  /** 仅自定义模板可删除，预设模板不生效 */
  removeTemplate: (templateId: string) => void;
  getTemplate: (id: string) => DecisionTemplate | undefined;
}

/** 从 localStorage 恢复模板列表；无数据 / 解析失败时回退预设模板 */
function loadTemplates(): DecisionTemplate[] {
  if (typeof window === "undefined") return presetTemplates;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return presetTemplates;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return presetTemplates;
    return parsed as DecisionTemplate[];
  } catch {
    return presetTemplates;
  }
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: presetTemplates,
  hasHydrated: false,

  updateOptions: (templateId, options) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === templateId ? { ...t, options } : t
      ),
    })),

  updateTitle: (templateId, title) =>
    set((state) => ({
      templates: state.templates.map((t) =>
        t.id === templateId ? { ...t, title } : t
      ),
    })),

  addTemplate: ({ title, options }) =>
    set((state) => {
      const customCount = state.templates.filter((t) => t.custom).length;
      const template: DecisionTemplate = {
        id: genId("tpl"),
        title,
        emoji: "❓",
        tagline: "我的自定义决策",
        tone: CUSTOM_TONES[customCount % CUSTOM_TONES.length],
        options,
        custom: true,
      };
      return { templates: [...state.templates, template] };
    }),

  removeTemplate: (templateId) =>
    set((state) => ({
      templates: state.templates.filter(
        (t) => t.id !== templateId || !t.custom
      ),
    })),

  getTemplate: (id) => get().templates.find((t) => t.id === id),
}));

// 状态变更后自动写回 localStorage（水合完成前不写入，避免覆盖用户数据）
if (typeof window !== "undefined") {
  useTemplateStore.subscribe((state) => {
    if (!state.hasHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.templates));
    } catch {
      // 隐私模式或配额限制下静默降级为不持久化
    }
  });
}

/**
 * 水合 hook：组件挂载后从 localStorage 恢复用户数据。
 * 返回是否已水合完成；未完成时页面应渲染占位，避免 SSR 与客户端不一致。
 */
export function useHydratedTemplates(): boolean {
  const hydrated = useTemplateStore((s) => s.hasHydrated);
  useEffect(() => {
    if (!hydrated) {
      useTemplateStore.setState({
        templates: loadTemplates(),
        hasHydrated: true,
      });
    }
  }, [hydrated]);
  return hydrated;
}
