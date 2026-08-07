import { createElement, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cn } from "@/lib/cn";

type NeoCardProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

/**
 * 新粗野主义基础卡片容器（指南 4.1 节）
 * 纯黑粗边框 + 硬阴影；作为可点击元素（as="button"）时具备物理按压反馈。
 */
export function NeoCard<T extends ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: NeoCardProps<T>) {
  const Tag = (as ?? "div") as ElementType;
  return createElement(
    Tag,
    {
      className: cn(
        "border-2 border-black",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "transition-all duration-150 ease-out",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        className
      ),
      ...rest,
    },
    children
  );
}
