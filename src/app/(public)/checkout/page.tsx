"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { Button } from "@/frontend/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { ShoppingCart, User, CreditCard, ArrowRight, ArrowLeft, Trash2, Shield, Bitcoin, Lock } from "lucide-react";
import { Turnstile } from "@/frontend/components/ui/Turnstile";

const checkoutSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
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
  const year = parseInt("20" + digits.slice(2, 4), 10);
  if (month < 1 || month > 12) return "Invalid month";
  const now = new Date();
  if (new Date(year, month - 1) < new Date(now.getFullYear(), now.getMonth())) return "Card expired";
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [showCardForm, setShowCardForm] = useState(false);
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "declined">("idle");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);
  const [leadSaved, setLeadSaved] = useState(false);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (digits.length === 16) {
      setCardNumberError(luhn(digits) ? null : "Invalid card number");
    } else if (cardNumberError) {
      setCardNumberError(null);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length >= 3 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
    setCardExpiry(formatted);
    if (digits.length === 4) {
      setCardExpiryError(validateExpiry(formatted));
    } else if (cardExpiryError) {
      setCardExpiryError(null);
    }
  };

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

  const handleCardPayment = () => {
    const numErr = !luhn(cardNumber) ? "Please enter a valid card number." : null;
    const expErr = validateExpiry(cardExpiry) ?? null;
    setCardNumberError(numErr ? "Invalid card number" : null);
    setCardExpiryError(expErr);
    if (numErr) { setError(numErr); return; }
    if (expErr) { setError(expErr); return; }
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ ticketId: i.ticketId, quantity: i.quantity, unitPrice: i.resalePrice })),
          totalAmount: total,
          currency: "EUR",
          guestName: data.name,
          guestEmail: data.email,
        }),
      }).catch(() => { setLeadSaved(false); });
    }
    setStep(2);
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
          <form className="space-y-5" onSubmit={handleSubmit(handleDetailsSubmit)}>
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

            {!showCardForm ? (
              <>
                {/* Payment method selector */}
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a2a2a]">
                    <p className="text-white font-semibold text-sm">Choose Payment Method</p>
                  </div>

                  {/* Card payment */}
                  <button
                    type="button"
                    onClick={() => { setCardName(getValues("name") ?? ""); setShowCardForm(true); setError(""); }}
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-white/[0.03] transition-colors border-b border-[#1a1a1a] group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-white font-semibold text-sm">Pay with Card</p>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-medium">Recommended</span>
                      </div>
                      <p className="text-zinc-500 text-xs">Visa · Mastercard · Amex</p>
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

                <div className="flex items-center justify-center gap-3 text-zinc-600 text-xs">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL Encrypted</span>
                </div>

                <Button variant="secondary" size="lg" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              </>
            ) : paymentState === "processing" ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                {/* Spinner */}
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#1a1a1a" strokeWidth="5" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke="#c9a84c" strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray="54 160"
                      className="animate-spin origin-center"
                      style={{ animationDuration: "1s" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-[#c9a84c]" />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-white font-semibold text-lg">Processing payment…</p>
                  <p className="text-zinc-500 text-sm">Please don&apos;t close this window</p>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 text-xs">
                  <Shield className="w-3 h-3" /> 256-bit SSL
                </div>
              </div>

            ) : paymentState === "declined" ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-5">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="text-center space-y-2 max-w-sm">
                  <p className="text-white font-bold text-lg">Payment Declined</p>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    We were unable to process your payment. Your card issuer declined the transaction.
                  </p>
                </div>
                <div className="bg-[#111111] border border-red-500/20 rounded-xl p-4 w-full text-sm text-zinc-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="text-white">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Card</span>
                    <span className="text-white">•••• {cardNumber.replace(/\s/g, "").slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-red-400 font-medium">Declined</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => { setPaymentState("idle"); setError(""); }}
                    className="w-full py-3 rounded-xl bg-[#c9a84c] text-black text-sm font-bold hover:bg-[#d4b05e] transition-all"
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
                    className="w-full py-3 rounded-xl bg-[#111111] border border-[#2a2a2a] text-zinc-400 text-sm font-medium hover:text-white hover:border-[#3a3a3a] transition-all flex items-center justify-center gap-2"
                  >
                    <Bitcoin className="w-4 h-4" /> Pay with Crypto instead
                  </button>
                </div>
              </div>

            ) : (
              <>
                {/* Card form */}
                <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold text-sm">Card Details</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setShowCardForm(false); setError(""); setCardNumber(""); setCardExpiry(""); setCardCvc(""); setCardNumberError(null); setCardExpiryError(null); }}
                      className="text-zinc-500 hover:text-white transition-colors text-xs flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" /> Change
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Card number */}
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Card Number</label>
                      <div className="relative">
                        <input
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onBlur={() => {
                            if (cardNumber) setCardNumberError(luhn(cardNumber) ? null : "Invalid card number");
                          }}
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          inputMode="numeric"
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus-visible:outline-none transition-colors tracking-widest pr-24 ${
                            cardNumberError ? "border-red-500/60 focus:border-red-500/60" : luhn(cardNumber) ? "border-emerald-500/50 focus:border-emerald-500/50" : "border-[#2a2a2a] focus:border-blue-500/50"
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          {(["VISA", "MC", "AMEX"] as const).map((b) => {
                            const brand = getCardBrand(cardNumber);
                            const active = brand === b;
                            return (
                              <span key={b} className={`text-[9px] font-bold border rounded px-1 py-0.5 leading-none transition-colors ${active ? "text-white border-white/40" : "text-zinc-600 border-zinc-700"}`}>{b}</span>
                            );
                          })}
                        </div>
                      </div>
                      {cardNumberError && <p className="mt-1 text-red-400 text-xs">{cardNumberError}</p>}
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Expiry Date</label>
                        <input
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          onBlur={() => {
                            if (cardExpiry) setCardExpiryError(validateExpiry(cardExpiry));
                          }}
                          placeholder="MM / YY"
                          maxLength={7}
                          inputMode="numeric"
                          className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus-visible:outline-none transition-colors ${
                            cardExpiryError ? "border-red-500/60 focus:border-red-500/60" : cardExpiry.replace(/[\s/]/g, "").length === 4 && !cardExpiryError ? "border-emerald-500/50 focus:border-emerald-500/50" : "border-[#2a2a2a] focus:border-blue-500/50"
                          }`}
                        />
                        {cardExpiryError && <p className="mt-1 text-red-400 text-xs">{cardExpiryError}</p>}
                      </div>
                      <div>
                        <label className="block text-zinc-400 text-xs mb-1.5 font-medium">CVV</label>
                        <input
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          inputMode="numeric"
                          className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus-visible:outline-none focus:border-blue-500/50 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Cardholder name */}
                    <div>
                      <label className="block text-zinc-400 text-xs mb-1.5 font-medium">Cardholder Name</label>
                      <input
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="As it appears on your card"
                        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus-visible:outline-none focus:border-blue-500/50 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Pay button */}
                <button
                  type="button"
                  onClick={handleCardPayment}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#c9a84c] text-black text-sm font-bold hover:bg-[#d4b05e] transition-all shadow-lg shadow-[#c9a84c]/20 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {isLoading ? "Processing…" : `Pay ${formatPrice(total)} securely`}
                </button>

                <p className="text-zinc-600 text-xs text-center flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3" /> 256-bit SSL · Secured Payment
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
