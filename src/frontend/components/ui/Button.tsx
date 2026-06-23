import { cn } from "@/backend/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:opacity-50 disabled:cursor-not-allowed select-none",
          {
            // Sizes
            "px-3 py-1.5 text-sm": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-8 py-3.5 text-base": size === "lg",
            // Variants
            "bg-[#c9a84c] text-black hover:bg-[#e8c05a] active:bg-[#b89438] shadow-lg shadow-[#c9a84c]/20":
              variant === "primary",
            "bg-[#161616] text-white border border-[#2a2a2a] hover:bg-[#1f1f1f] hover:border-[#3a3a3a]":
              variant === "secondary",
            "border border-[#c9a84c] text-[#c9a84c] hover:bg-[#c9a84c]/10 active:bg-[#c9a84c]/20":
              variant === "outline",
            "text-zinc-400 hover:text-white hover:bg-white/5":
              variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800":
              variant === "danger",
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
