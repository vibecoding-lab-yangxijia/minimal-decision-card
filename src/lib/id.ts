/**
 * 通用 id 生成：优先使用 Web Crypto 的 randomUUID，
 * 在不支持的环境（非安全上下文）回退到时间戳 + 随机数。
 */
export function genId(prefix = "id"): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
