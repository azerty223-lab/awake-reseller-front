import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "success" | "warning" | "error" | "info" | "purple" | "rose";
  className?: string;
  size?: "sm" | "md";
}

export function Badge({ children, variant = "default", className, size = "md" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        {
          "bg-zinc-800 text-zinc-300 border border-zinc-700": variant === "default",
          "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/30": variant === "gold",
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30": variant === "success",
          "bg-amber-500/15 text-amber-400 border border-amber-500/30": variant === "warning",
          "bg-red-500/15 text-red-400 border border-red-500/30": variant === "error",
          "bg-blue-500/15 text-blue-400 border border-blue-500/30": variant === "info",
          "bg-purple-500/15 text-purple-400 border border-purple-500/30": variant === "purple",
          "bg-rose-500/15 text-rose-400 border border-rose-500/30": variant === "rose",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
