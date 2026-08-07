/**
 * 加权随机抽取（指南 4.2 节 getRandomResult 的核心算法）
 * 按各选项 weight 权重成比例抽选；权重为 0 的选项不会被抽中。
 */
export function pickWeighted<T extends { weight: number }>(
  options: readonly T[]
): T {
  if (options.length === 0) {
    throw new Error("pickWeighted: options 不能为空");
  }

  const total = options.reduce((sum, o) => sum + Math.max(o.weight, 0), 0);

  // 全部权重为 0 时退化为均匀随机
  if (total <= 0) {
    return options[Math.floor(Math.random() * options.length)];
  }

  let r = Math.random() * total;
  for (const option of options) {
    r -= Math.max(option.weight, 0);
    if (r < 0) return option;
  }
  return options[options.length - 1];
}
