"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { Button } from "@/frontend/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  ShoppingCart, CreditCard, ArrowRight, ArrowLeft,
  Trash2, Shield, Bitcoin, Lock, Check, Minus, Plus,
} from "lucide-react";
import { Turnstile } from "@/frontend/components/ui/Turnstile";

// ── Validation ─────────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const STEPS = ["Cart", "Details", "Payment"] as const;

function luhn(value: string): boolean {
  const digits = value.replace(/\s/g, "");
  if (digits.length < 13 || !/^\d+$/.test(digits)) return false;
  let sum = 0, isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10);
    if (isEven) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function getCardBrand(value: string): "VISA" | "MC" | "AMEX" | null {
  const n = value.replace(/\s/g, "");
  if (/^4/.test(n)) return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "MC";
  if (/^3[47]/.test(n)) return "AMEX";
  return null;
}

function validateExpiry(value: string): string | null {
  const digits = value.replace(/[\s/]/g, "");
  if (digits.length < 4) return "Enter expiry date";
  const month = parseInt(digits.slice(0, 2), 10);
  const year  = parseInt("20" + digits.slice(2, 4), 10);
  if (month < 1 || month > 12) return "Invalid month";
  const now = new Date();
  if (new Date(year, month - 1) < new Date(now.getFullYear(), now.getMonth())) return "Card expired";
  return null;
}

// ── Style tokens ────────────────────────────────────────────────────────────

// Labels: uppercase tracking style — visually distinct from input values
const LABEL = "block text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-2";

// Inputs: fractional elevation below card surface; gold focus ring
const INPUT = [
  "w-full px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-lg",
  "text-zinc-100 placeholder-zinc-700 text-sm",
  "focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/[0.1]",
  "transition-all",
].join(" ");

// ── Order sidebar ───────────────────────────────────────────────────────────
// Always visible on steps 1+2 — order must be present while user commits data

interface OrderSidebarProps {
  items: Array<{
    ticketId: string;
    name: string;
    dayLabel?: string | null;
    resalePrice: number;
    currency: string;
    quantity: number;
  }>;
  total: number;
}

function OrderSidebar({ items, total }: OrderSidebarProps) {
  return (
    <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl overflow-hidden sticky top-24">
      {/* Section label */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Order Summary</p>
      </div>

      {/* Items */}
      <div className="px-5 py-4 space-y-4 border-b border-white/[0.06]">
        {items.map((item) => (
          <div key={item.ticketId} className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200 font-medium leading-snug">{item.name}</p>
              {item.dayLabel && (
                <p className="text-[11px] text-zinc-600 mt-0.5">{item.dayLabel}</p>
              )}
              <p className="text-[11px] text-zinc-700 mt-0.5">Qty {item.quantity}</p>
            </div>
            <span
              className="text-sm font-semibold text-white tabular-nums shrink-0"
              style={{ letterSpacing: "-0.015em" }}
            >
              {formatPrice(item.resalePrice * item.quantity, item.currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Total — white, dominant; not gold */}
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-500">Total</span>
          <span
            className="font-semibold text-white tabular-nums"
            style={{ fontSize: "1.25rem", letterSpacing: "-0.02em" }}
          >
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-700">All fees included</p>
      </div>

      {/* Trust signals — answer the three purchase anxieties:
          is payment safe? will I get the ticket? is this legitimate?
          Placed here so they're always visible alongside the price. */}
      <div className="px-5 py-4 space-y-2.5">
        {[
          { Icon: Shield, text: "256-bit SSL encrypted checkout" },
          { Icon: Check,  text: "Ticket delivered to your inbox" },
          { Icon: Lock,   text: "Verified resale — official partner" },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2.5 text-zinc-600">
            <Icon className="w-3 h-3 shrink-0 text-zinc-700" />
            <span className="text-xs">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Checkout page ───────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  const [step, setStep]               = useState(0);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "declined">("idle");
  const [cardNumber, setCardNumber]   = useState("");
  const [cardExpiry, setCardExpiry]   = useState("");
  const [cardCvc, setCardCvc]         = useState("");
  const [cardName, setCardName]       = useState("");
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
  const [leadSaved, setLeadSaved]     = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits    = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (digits.length === 16) setCardNumberError(luhn(digits) ? null : "Invalid card number");
    else if (cardNumberError) setCardNumberError(null);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits    = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length >= 3 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
    setCardExpiry(formatted);
    if (digits.length === 4) setCardExpiryError(validateExpiry(formatted));
    else if (cardExpiryError) setCardExpiryError(null);
  };

  const { register, handleSubmit, formState: { errors }, getValues } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    setError("");
    try {
      const res    = await fetch("/api/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          items: items.map((i) => ({
            ticketId:    i.ticketId,
            name:        i.name,
            quantity:    i.quantity,
            resalePrice: i.resalePrice,
            currency:    i.currency,
          })),
          customerEmail: data.email,
          customerName:  data.name,
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

  const handleCardPayment = () => {
    const numErr = !luhn(cardNumber) ? "Please enter a valid card number." : null;
    const expErr = validateExpiry(cardExpiry) ?? null;
    setCardNumberError(numErr ? "Invalid card number" : null);
    setCardExpiryError(expErr);
    if (numErr)          { setError(numErr); return; }
    if (expErr)          { setError(expErr); return; }
    if (cardCvc.length < 3) { setError("Please enter your CVV."); return; }
    if (!cardName.trim()) { setError("Please enter the cardholder name."); return; }
    setError("");
    setPaymentState("processing");
    void onSubmit(getValues());
    setTimeout(() => setPaymentState("declined"), 5000);
  };

  const handleDetailsSubmit = async (data: CheckoutForm) => {
    if (!leadSaved) {
      setLeadSaved(true);
      fetch("/api/checkout/order", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          items: items.map((i) => ({ ticketId: i.ticketId, quantity: i.quantity, unitPrice: i.resalePrice })),
          totalAmount: total,
          currency:    "EUR",
          guestName:   data.name,
          guestEmail:  data.email,
        }),
      }).catch(() => { setLeadSaved(false); });
    }
    setStep(2);
  };

  // ── Empty cart ────────────────────────────────────────────────────────────

  if (items.length === 0 && step === 0) {
    return (
      <div className="min-h-screen bg-[#080809] flex items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C9A84C]/[0.025] blur-[120px] pointer-events-none" />
        <div className="relative text-center max-w-xs">
          <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-5 h-5 text-zinc-600" />
          </div>
          <h2 className="text-zinc-100 font-semibold text-lg mb-2">Your cart is empty</h2>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
            Add tickets to your cart before checking out.
          </p>
          <button
            onClick={() => router.push("/tickets")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#D4B855] transition-colors"
          >
            Browse Tickets
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ── Main checkout ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#080809] relative">
      {/* Atmospheric ambient — very faint gold warmth at top, ties to brand */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#C9A84C]/[0.022] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Page header: brand left, stepper right ──────────────────── */}
        <div className="flex items-center justify-between mb-12">

          {/* Brand context */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-600 font-medium mb-0.5">
              Awakenings Festival 2026
            </p>
            <h1
              className="font-[var(--font-playfair)] font-black text-zinc-100"
              style={{ fontSize: "1.25rem", letterSpacing: "-0.015em" }}
            >
              Secure Checkout
            </h1>
          </div>

          {/* Step indicator — text-based, no floating circles */}
          <nav className="flex items-center gap-1" aria-label="Checkout steps">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center">
                <div className={[
                  "flex items-center gap-1.5",
                  i === step   ? "text-zinc-100"        : "",
                  i < step     ? "text-[#C9A84C]/65"    : "",
                  i > step     ? "text-zinc-700"         : "",
                ].join(" ")}>
                  {i < step ? (
                    <div className="w-3.5 h-3.5 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center">
                      <Check className="w-2 h-2 text-[#C9A84C]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  )}
                  <span className="text-xs font-medium hidden sm:block">{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-3 h-px w-6 ${i < step ? "bg-[#C9A84C]/25" : "bg-white/[0.07]"}`} />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* ── Step 0: Cart review ──────────────────────────────────────── */}
        {step === 0 && (
          <div className="max-w-xl">

            {/* Items */}
            <div className="space-y-3 mb-3">
              {items.map((item) => (
                <div
                  key={item.ticketId}
                  className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl p-5"
                >
                  {/* Name + price — correct reading order: what → how much */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[0.9375rem] font-medium text-zinc-100 leading-snug"
                        style={{ letterSpacing: "-0.006em" }}
                      >
                        {item.name}
                      </p>
                      {item.dayLabel && (
                        <p className="text-xs text-zinc-600 mt-1">{item.dayLabel}</p>
                      )}
                    </div>

                    {/* Price — dominant, right-aligned, white */}
                    <div className="text-right shrink-0">
                      <p
                        className="font-semibold text-white tabular-nums"
                        style={{ fontSize: "1.125rem", letterSpacing: "-0.02em" }}
                      >
                        {formatPrice(item.resalePrice * item.quantity, item.currency)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-zinc-700 mt-0.5">
                          {formatPrice(item.resalePrice, item.currency)} × {item.quantity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.05] mt-4 mb-3" />

                  {/* Quantity stepper + remove — structured, not ad hoc */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden bg-white/[0.02]">
                      <button
                        onClick={() => updateQuantity(item.ticketId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors border-r border-white/[0.07]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.ticketId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors border-l border-white/[0.07] disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.ticketId)}
                      className="flex items-center gap-1.5 text-zinc-700 hover:text-red-400/75 transition-colors text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total + proceed — combined card keeps action next to context */}
            <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl p-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                  Order Total
                </span>
                <span
                  className="font-semibold text-white tabular-nums"
                  style={{ fontSize: "1.5rem", letterSpacing: "-0.025em" }}
                >
                  {formatPrice(total)}
                </span>
              </div>
              <p className="text-xs text-zinc-700 mb-5">
                All fees included · {items.length} item{items.length !== 1 ? "s" : ""}
              </p>

              <button
                onClick={() => setStep(1)}
                className="w-full h-11 flex items-center justify-center gap-2.5 rounded-lg bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#D4B855] transition-colors active:scale-[0.99]"
              >
                Continue to Details
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Steps 1+2: split layout ──────────────────────────────────── */}
        {step > 0 && (
          <div className="grid md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Left: form content */}
            <div>

              {/* ── Step 1: Customer details ─────────────────────────── */}
              {step === 1 && (
                <form onSubmit={handleSubmit(handleDetailsSubmit)}>
                  <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl p-6 mb-5">

                    {/* Section header */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                      <h2 className="text-sm font-semibold text-zinc-100">Your Details</h2>
                      <div className="flex items-center gap-1.5 text-zinc-600 text-xs">
                        <Lock className="w-3 h-3" />
                        <span>Secure</span>
                      </div>
                    </div>

                    <div className="space-y-5">
                      {/* Full name */}
                      <div>
                        <label className={LABEL}>Full Name</label>
                        <input
                          {...register("name")}
                          placeholder="As it appears on your ID"
                          className={INPUT}
                          autoComplete="name"
                        />
                        {errors.name && (
                          <p className="mt-1.5 text-xs text-red-400/80">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className={LABEL}>Email Address</label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="your@email.com"
                          className={INPUT}
                          autoComplete="email"
                        />
                        {errors.email && (
                          <p className="mt-1.5 text-xs text-red-400/80">{errors.email.message}</p>
                        )}
                        <p className="mt-1.5 text-[10px] text-zinc-600">
                          Your ticket will be sent to this address
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={LABEL}>
                          Phone
                          <span className="ml-1 normal-case text-zinc-700 tracking-normal font-normal">
                            (optional)
                          </span>
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+31 6 12345678"
                          className={INPUT}
                          autoComplete="tel"
                        />
                      </div>

                      <Turnstile onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
                    </div>
                  </div>

                  {/* Actions — primary CTA dominant, back subordinate */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex items-center gap-1.5 px-4 py-2.5 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 h-11 flex items-center justify-center gap-2.5 rounded-lg bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#D4B855] transition-colors active:scale-[0.99]"
                    >
                      Continue to Payment
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 2: Payment ──────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-4">

                  {/* Inline order recap (compact, references sidebar) */}
                  <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl p-5">
                    <p className={`${LABEL} mb-3`}>Confirming order for</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400">{getValues("name")}</span>
                      <span className="text-zinc-500">{getValues("email")}</span>
                    </div>
                  </div>

                  {!showCardForm ? (
                    <>
                      {/* Payment method selector */}
                      <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.06]">
                          <p className={LABEL}>Payment Method</p>
                        </div>

                        {/* Card */}
                        <button
                          type="button"
                          onClick={() => { setCardName(getValues("name") ?? ""); setShowCardForm(true); setError(""); }}
                          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors border-b border-white/[0.05] group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-500/[0.08] border border-blue-500/[0.14] flex items-center justify-center shrink-0">
                            <CreditCard className="w-4 h-4 text-blue-400/80" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-medium text-zinc-100">Pay with Card</p>
                              <span className="text-[10px] bg-emerald-500/[0.08] text-emerald-400/80 border border-emerald-500/[0.14] px-1.5 py-0.5 rounded font-medium">
                                Recommended
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600">Visa · Mastercard · Amex</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                        </button>

                        {/* Crypto */}
                        <button
                          type="button"
                          onClick={() => {
                            const n = encodeURIComponent(getValues("name") ?? "");
                            const e = encodeURIComponent(getValues("email") ?? "");
                            router.push(`/checkout/crypto?name=${n}&email=${e}`);
                          }}
                          className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/[0.08] border border-[#C9A84C]/[0.14] flex items-center justify-center shrink-0">
                            <Bitcoin className="w-4 h-4 text-[#C9A84C]/80" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-zinc-100 mb-0.5">Pay with Crypto</p>
                            <p className="text-xs text-zinc-600">BTC · ETH · USDT · SOL — no extra fees</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 px-1 py-2 text-zinc-500 text-sm hover:text-zinc-300 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                      </button>
                    </>

                  ) : paymentState === "processing" ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-6">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                          <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                          <circle
                            cx="32" cy="32" r="27" fill="none"
                            stroke="#C9A84C" strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray="42 128"
                            className="animate-spin origin-center"
                            style={{ animationDuration: "1s" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-5 h-5 text-[#C9A84C]/80" />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-100 font-semibold mb-1">Processing payment…</p>
                        <p className="text-zinc-500 text-sm">Please don&apos;t close this window</p>
                      </div>
                    </div>

                  ) : paymentState === "declined" ? (
                    <div className="flex flex-col items-center py-10 gap-5">
                      <div className="w-14 h-14 rounded-xl bg-red-500/[0.08] border border-red-500/[0.15] flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-zinc-100 font-semibold text-lg mb-1">Payment Declined</p>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                          Your card issuer declined the transaction. Please try a different card or payment method.
                        </p>
                      </div>
                      <div className="bg-[#0D0D0F] border border-red-500/[0.15] rounded-xl p-4 w-full text-sm text-zinc-500 space-y-2">
                        <div className="flex justify-between">
                          <span>Amount</span>
                          <span className="text-zinc-200">{formatPrice(total)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Card</span>
                          <span className="text-zinc-200">•••• {cardNumber.replace(/\s/g, "").slice(-4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status</span>
                          <span className="text-red-400/80 font-medium">Declined</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2.5 w-full">
                        <button
                          type="button"
                          onClick={() => { setPaymentState("idle"); setError(""); }}
                          className="w-full h-11 rounded-lg bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#D4B855] transition-colors"
                        >
                          Try another card
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const n = encodeURIComponent(getValues("name") ?? "");
                            const e = encodeURIComponent(getValues("email") ?? "");
                            router.push(`/checkout/crypto?name=${n}&email=${e}`);
                          }}
                          className="w-full h-11 rounded-lg border border-white/[0.08] text-zinc-400 text-sm font-medium hover:text-zinc-200 hover:border-white/[0.14] transition-colors flex items-center justify-center gap-2"
                        >
                          <Bitcoin className="w-4 h-4" />
                          Pay with Crypto instead
                        </button>
                      </div>
                    </div>

                  ) : (
                    <>
                      {/* Card form */}
                      <div className="bg-[#0D0D0F] border border-white/[0.07] rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-blue-400/80" />
                            <span className="text-sm font-medium text-zinc-100">Card Details</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCardForm(false); setError("");
                              setCardNumber(""); setCardExpiry(""); setCardCvc("");
                              setCardNumberError(null); setCardExpiryError(null);
                            }}
                            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors flex items-center gap-1"
                          >
                            <ArrowLeft className="w-3 h-3" />
                            Change
                          </button>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Card number */}
                          <div>
                            <label className={LABEL}>Card Number</label>
                            <div className="relative">
                              <input
                                value={cardNumber}
                                onChange={handleCardNumberChange}
                                onBlur={() => { if (cardNumber) setCardNumberError(luhn(cardNumber) ? null : "Invalid card number"); }}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                inputMode="numeric"
                                className={[
                                  INPUT, "pr-24 tracking-widest",
                                  cardNumberError      ? "!border-red-500/40" : "",
                                  luhn(cardNumber)     ? "!border-emerald-500/35" : "",
                                ].join(" ")}
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                                {(["VISA", "MC", "AMEX"] as const).map((b) => {
                                  const active = getCardBrand(cardNumber) === b;
                                  return (
                                    <span
                                      key={b}
                                      className={`text-[9px] font-bold border rounded px-1 py-0.5 leading-none transition-colors ${
                                        active ? "text-zinc-200 border-white/25" : "text-zinc-700 border-white/[0.07]"
                                      }`}
                                    >
                                      {b}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                            {cardNumberError && <p className="mt-1.5 text-xs text-red-400/80">{cardNumberError}</p>}
                          </div>

                          {/* Expiry + CVV */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className={LABEL}>Expiry Date</label>
                              <input
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                onBlur={() => { if (cardExpiry) setCardExpiryError(validateExpiry(cardExpiry)); }}
                                placeholder="MM / YY"
                                maxLength={7}
                                inputMode="numeric"
                                className={[
                                  INPUT,
                                  cardExpiryError ? "!border-red-500/40" : "",
                                  cardExpiry.replace(/[\s/]/g, "").length === 4 && !cardExpiryError ? "!border-emerald-500/35" : "",
                                ].join(" ")}
                              />
                              {cardExpiryError && <p className="mt-1.5 text-xs text-red-400/80">{cardExpiryError}</p>}
                            </div>
                            <div>
                              <label className={LABEL}>CVV</label>
                              <input
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="•••"
                                maxLength={4}
                                inputMode="numeric"
                                className={INPUT}
                              />
                            </div>
                          </div>

                          {/* Cardholder name */}
                          <div>
                            <label className={LABEL}>Cardholder Name</label>
                            <input
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              placeholder="As it appears on your card"
                              className={INPUT}
                              autoComplete="cc-name"
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="bg-red-500/[0.07] border border-red-500/[0.2] rounded-lg p-3.5">
                          <p className="text-red-400/90 text-sm">{error}</p>
                        </div>
                      )}

                      {/* Pay CTA — most dominant element on page */}
                      <button
                        type="button"
                        onClick={handleCardPayment}
                        disabled={isLoading}
                        className="w-full h-12 flex items-center justify-center gap-2.5 rounded-lg bg-[#C9A84C] text-black text-sm font-semibold hover:bg-[#D4B855] transition-colors shadow-[0_4px_24px_rgba(201,168,76,0.18)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                      >
                        <Lock className="w-4 h-4" />
                        {isLoading ? "Processing…" : `Pay ${formatPrice(total)} securely`}
                      </button>

                      <p className="text-center text-[10px] text-zinc-700 flex items-center justify-center gap-1.5">
                        <Shield className="w-3 h-3" />
                        256-bit SSL · PCI-DSS Level 1
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right: sticky order summary */}
            <div className="hidden md:block">
              <OrderSidebar items={items} total={total} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
