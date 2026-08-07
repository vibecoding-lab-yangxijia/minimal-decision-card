import type { DecisionTemplate } from "./types";

/**
 * 场景化预设模板库（指南 1.2 节）
 * 骨架阶段为静态常量；后续阶段将迁入 Zustand store，
 * 支持用户自定义模板与权重编辑。
 */
export const templates: DecisionTemplate[] = [
  {
    id: "eat",
    title: "今天中午吃什么？",
    emoji: "🍜",
    tagline: "打工人的世纪难题",
    tone: "pink",
    options: [
      { id: "mc", text: "麦当劳", weight: 1 },
      { id: "salad", text: "轻食沙拉", weight: 1 },
      { id: "riceball", text: "便利店饭团", weight: 1 },
      { id: "noodle", text: "兰州拉面", weight: 1 },
      { id: "diet", text: "不吃了，就当减肥", weight: 1 },
    ],
  },
  {
    id: "go",
    title: "周末去哪儿？",
    emoji: "🗺️",
    tagline: "别让周末烂在沙发上",
    tone: "green",
    options: [
      { id: "home", text: "宅家打游戏", weight: 1 },
      { id: "cafe", text: "去咖啡厅发呆", weight: 1 },
      { id: "movie", text: "看场爆米花电影", weight: 1 },
      { id: "citywalk", text: "Citywalk 压马路", weight: 1 },
    ],
  },
  {
    id: "buy",
    title: "这笔钱该不该花？",
    emoji: "🛍️",
    tagline: "消费冲动的冷静期",
    tone: "yellow",
    options: [
      { id: "buy-now", text: "买了早享受", weight: 1 },
      { id: "wait", text: "再等双十一", weight: 1 },
      { id: "tax", text: "纯纯智商税", weight: 1 },
      { id: "treat", text: "把钱用来吃顿好的", weight: 1 },
    ],
  },
  {
    id: "social",
    title: "今晚找什么借口不去聚会？",
    emoji: "🎭",
    tagline: "社交能量告急",
    tone: "cyan",
    options: [
      { id: "stomach", text: "肠胃炎犯了", weight: 1 },
      { id: "cat", text: "猫突然吐了", weight: 1 },
      { id: "overtime", text: "公司临时加班", weight: 1 },
      { id: "dead", text: "直接装死", weight: 1 },
    ],
  },
];

export function getTemplateById(id: string | undefined): DecisionTemplate | undefined {
  return templates.find((t) => t.id === id);
}
