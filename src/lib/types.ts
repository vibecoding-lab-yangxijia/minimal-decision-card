/** 决策模板类型定义（指南 4.2 节数据结构模型） */

export type SceneTone = "pink" | "green" | "yellow" | "cyan";

export interface DecisionOption {
  id: string;
  text: string;
  /** 抽取权重，默认 1；值越大越容易被随机抽中 */
  weight: number;
}

export interface DecisionTemplate {
  id: string;
  title: string;
  /** 首页入口卡片的展示元数据 */
  emoji: string;
  tagline: string;
  tone: SceneTone;
  options: DecisionOption[];
  /** 用户新建的自定义模板标记（预设模板无此字段，不可删除） */
  custom?: boolean;
}
