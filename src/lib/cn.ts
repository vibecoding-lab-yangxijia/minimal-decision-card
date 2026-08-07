/** 极简 class 拼接工具（骨架阶段零依赖；后续可替换为 clsx + tailwind-merge） */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
