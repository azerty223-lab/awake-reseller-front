"use client";

import { cn } from "@/backend/lib/utils";
import type { CryptoPaymentStatus } from "@prisma/client";

interface PaymentStatusProps {
  status: CryptoPaymentStatus;
  confirmations?: number;
  requiredConfirmations?: number;
  className?: string;
}

const STATUS_CONFIG: Record<
  CryptoPaymentStatus,
  { label: string; color: string; dotColor: string; icon: string }
> = {
  WAITING_PAYMENT: {
    label: "Waiting for payment",
    color: "text-zinc-400",
    dotColor: "bg-zinc-500",
    icon: "⏳",
  },
  PAYMENT_DETECTED: {
    label: "Payment detected",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    icon: "🔍",
  },
  PAYMENT_PENDING_CONFIRMATION: {
    label: "Confirming on blockchain",
    color: "text-yellow-400",
    dotColor: "bg-yellow-400",
    icon: "⛓",
  },
  PAID: {
    label: "Payment confirmed!",
    color: "text-green-400",
    dotColor: "bg-green-400",
    icon: "✓",
  },
  EXPIRED: {
    label: "Invoice expired",
    color: "text-red-400",
    dotColor: "bg-red-500",
    icon: "✕",
  },
  FAILED: {
    label: "Payment failed",
    color: "text-red-400",
    dotColor: "bg-red-500",
    icon: "✕",
  },
  UNDERPAID: {
    label: "Underpayment detected",
    color: "text-orange-400",
    dotColor: "bg-orange-400",
    icon: "⚠",
  },
  OVERPAID: {
    label: "Overpayment detected",
    color: "text-orange-400",
    dotColor: "bg-orange-400",
    icon: "⚠",
  },
};

export function PaymentStatus({
  status,
  confirmations = 0,
  requiredConfirmations = 12,
  className,
}: PaymentStatusProps) {
  const config = STATUS_CONFIG[status];
  const isPending = status === "PAYMENT_PENDING_CONFIRMATION";
  const isPaid = status === "PAID";

  return (
    <div className={cn("space-y-3", className)}>
      {/* Status row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div
            className={cn(
              "w-3 h-3 rounded-full",
              config.dotColor,
              status === "WAITING_PAYMENT" || isPending ? "animate-pulse" : ""
            )}
          />
          {(status === "WAITING_PAYMENT" || isPending) && (
            <div
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-40",
                config.dotColor
              )}
            />
          )}
        </div>
        <span className={cn("text-sm font-medium", config.color)}>
          {config.icon} {config.label}
        </span>
      </div>

      {/* Confirmations progress bar */}
      {isPending && requiredConfirmations > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>Confirmations</span>
            <span className="text-[#c9a84c] font-medium">
              {confirmations} / {requiredConfirmations}
            </span>
          </div>
          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8af2a] rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (confirmations / requiredConfirmations) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* PAID success message */}
      {isPaid && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-400 text-sm font-medium">
            Payment received! Processing your order...
          </p>
        </div>
      )}
    </div>
  );
}
