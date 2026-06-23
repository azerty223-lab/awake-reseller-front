"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { Button } from "@/frontend/components/ui/Button";
import { Badge } from "@/frontend/components/ui/Badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ShoppingCart, User, CreditCard, ArrowRight, ArrowLeft, Trash2, Shield, Bitcoin } from "lucide-react";
import { Turnstile } from "@/frontend/components/ui/Turnstile";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const STEPS = ["Cart", "Details", "Payment"] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const leadSavedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            ticketId: i.ticketId,
            name: i.name,
            quantity: i.quantity,
            resalePrice: i.resalePrice,
            currency: i.currency,
          })),
          customerEmail: data.email,
          customerName: data.name,
          customerPhone: data.phone,
          turnstileToken,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error ?? "Checkout failed");
      }

      if (result.url) {
        clearCart();
        window.location.href = result.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setIsLoading(true);
    setError("");
    const data = getValues();
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            ticketId: i.ticketId,
            name: i.name,
            quantity: i.quantity,
            resalePrice: i.resalePrice,
            currency: i.currency,
          })),
          customerEmail: data.email,
          customerName: data.name,
          customerPhone: data.phone,
          turnstileToken,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Checkout failed");
      if (result.url) { clearCart(); window.location.href = result.url; }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  if (items.length === 0 && step === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-8 h-8 text-zinc-600" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-zinc-500 mb-6">Add some tickets to proceed to checkout</p>
          <Button variant="primary" onClick={() => router.push("/tickets")}>
            Browse Tickets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-zinc-500 text-sm">Awakenings Festival 2026 · Secure Checkout</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  i < step
                    ? "bg-[#c9a84c] text-black"
                    : i === step
                    ? "bg-[#c9a84c]/20 border-2 border-[#c9a84c] text-[#c9a84c]"
                    : "bg-[#161616] border border-[#2a2a2a] text-zinc-600"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`ml-2 text-xs font-medium ${
                  i <= step ? "text-white" : "text-zinc-600"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`mx-3 h-px w-8 ${i < step ? "bg-[#c9a84c]" : "bg-[#2a2a2a]"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Cart review */}
        {step === 0 && (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.ticketId}
                className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 flex items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{item.name}</p>
                  {item.dayLabel && <p className="text-zinc-500 text-sm mt-0.5">{item.dayLabel}</p>}
                  <p className="text-[#c9a84c] font-bold mt-1">
                    {formatPrice(item.resalePrice * item.quantity, item.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-[#0a0a0a] rounded-lg border border-[#2a2a2a] p-1">
                  <button
                    onClick={() => updateQuantity(item.ticketId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.ticketId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxQuantity}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.ticketId)}
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Total */}
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-xl p-5">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Total</span>
                <span className="text-white text-2xl font-bold">{formatPrice(total)}</span>
              </div>
              <p className="text-zinc-600 text-xs mt-2">Includes all fees · Crypto payment</p>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setStep(1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Details
            </Button>
          </div>
        )}

        {/* Step 1: Customer details */}
        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSubmit(async (data) => {
            // Save lead once — create PENDING order so admin can see name/email immediately
            if (!leadSavedRef.current) {
              leadSavedRef.current = true;
              fetch("/api/checkout/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items: items.map((i) => ({ ticketId: i.ticketId, quantity: i.quantity, unitPrice: i.resalePrice })),
                  totalAmount: total,
                  currency: "EUR",
                  guestName: data.name,
                  guestEmail: data.email,
                }),
              }).catch(() => { leadSavedRef.current = false; });
            }
            setStep(2);
          })}>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-[#c9a84c]" />
                <h2 className="text-white font-semibold">Your Details</h2>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Full Name *</label>
                <input
                  {...register("name")}
                  placeholder="As it appears on your ID"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                {errors.name && (
                  <p className="mt-1 text-red-400 text-xs">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Email Address *</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                {errors.email && (
                  <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>
                )}
                <p className="mt-1 text-zinc-600 text-xs">Your ticket will be sent to this address</p>
              </div>

              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Phone Number (optional)</label>
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+31 6 12345678"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
              </div>

              <Turnstile onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={() => setStep(0)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Order summary */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4 text-[#c9a84c]" />
                <h2 className="text-white font-semibold">Order Summary</h2>
              </div>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.ticketId} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.name} × {item.quantity}</span>
                    <span className="text-white">{formatPrice(item.resalePrice * item.quantity, item.currency)}</span>
                  </div>
                ))}
                <div className="border-t border-[#2a2a2a] pt-3 flex justify-between font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-[#c9a84c] text-xl">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Name</span>
                  <span className="text-white">{getValues("name")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Email</span>
                  <span className="text-white">{getValues("email")}</span>
                </div>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2a2a]">
                <p className="text-white font-semibold text-sm">Choose Payment Method</p>
              </div>

              {/* Card payment */}
              <button
                type="button"
                onClick={handleCardPayment}
                disabled={isLoading}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-white/[0.03] transition-colors border-b border-[#1a1a1a] group disabled:opacity-50"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm">Pay with Card</p>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium">Recommended</span>
                  </div>
                  <p className="text-zinc-500 text-xs">Visa · Mastercard · Amex — Secured by Stripe</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-1">
                    {["VISA", "MC", "AMEX"].map((b) => (
                      <span key={b} className="text-[9px] font-bold text-zinc-600 border border-zinc-700 rounded px-1 py-0.5 leading-none">{b}</span>
                    ))}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                </div>
              </button>

              {/* Crypto payment */}
              <button
                type="button"
                onClick={() => {
                  const n = encodeURIComponent(getValues("name") ?? "");
                  const e = encodeURIComponent(getValues("email") ?? "");
                  router.push(`/checkout/crypto?name=${n}&email=${e}`);
                }}
                className="w-full flex items-center gap-4 px-6 py-5 hover:bg-white/[0.03] transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center shrink-0">
                  <Bitcoin className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-semibold text-sm mb-0.5">Pay with Crypto</p>
                  <p className="text-zinc-500 text-xs">BTC · ETH · USDT · SOL — no extra fees</p>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-[#c9a84c] transition-colors" />
              </button>
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-3 text-zinc-600 text-xs">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
              <span>·</span>
              <span>PCI DSS via Stripe</span>
              <span>·</span>
              <span>No card data stored</span>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setStep(1)}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
