import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type NeoButtonProps = ComponentPropsWithoutRef<"button">;

/**
 * 新粗野主义基础按钮（指南 4.1 节）
 * 纯黑粗边框 + 硬阴影，点击时阴影消失、元素位移，营造物理按压感。
 */
export function NeoButton({ className, type = "button", ...rest }: NeoButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "border-2 border-black bg-paper px-5 py-3 text-sm font-black",
        "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "transition-all duration-150 ease-out",
        "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...rest}
    />
  );
}
