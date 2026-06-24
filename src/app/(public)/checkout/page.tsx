"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import {
  CreditCard, Shield, Bitcoin, Lock, Check, ArrowLeft,
} from "lucide-react";
import { Turnstile } from "@/frontend/components/ui/Turnstile";
import { StaticCryptoCheckout } from "@/frontend/components/crypto/StaticCryptoCheckout";

// ── Schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  name:  z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Card utilities ─────────────────────────────────────────────────────────

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
  if (/^4/.test(n))             return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "MC";
  if (/^3[47]/.test(n))         return "AMEX";
  return null;
}

function validateExpiry(value: string): string | null {
  const digits = value.replace(/[\s/]/g, "");
  if (digits.length < 4) return "Enter expiry date";
  const month = parseInt(digits.slice(0, 2), 10);
  const year  = parseInt("20" + digits.slice(2, 4), 10);
  if (month < 1 || month > 12) return "Invalid month";
  const now = new Date();
  if (new Date(year, month - 1) < new Date(now.getFullYear(), now.getMonth()))
    return "Card expired";
  return null;
}

// ── Styles ─────────────────────────────────────────────────────────────────

const INPUT = [
  "w-full px-4 py-3 rounded-lg text-sm text-zinc-100",
  "bg-[#111113] border border-white/[0.1] placeholder-zinc-700",
  "focus:outline-none focus:border-[#C9A84C]/55 focus:ring-1 focus:ring-[#C9A84C]/[0.09]",
  "transition-all duration-150",
].join(" ");

const LABEL = "block text-xs font-medium text-zinc-400 mb-2";

const SECTION = "text-sm font-semibold text-zinc-100 mb-5";

// ── Order summary ───────────────────────────────────────────────────────────

interface SummaryItem {
  ticketId: string;
  name: string;
  dayLabel?: string | null;
  resalePrice: number;
  currency: string;
  quantity: number;
}

function OrderSummary({ items, total }: { items: SummaryItem[]; total: number }) {
  return (
    <div className="bg-[#0D0D10] border border-white/[0.08] rounded-xl overflow-hidden">

      {/* Event context */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-1.5">
          Your Order
        </p>
        <p className="text-sm font-semibold text-zinc-100">Awakenings Festival 2026</p>
        <p className="text-xs text-zinc-500 mt-0.5">July 10–12 · Hilvarenbeek, Netherlands</p>
      </div>

      {/* Line items */}
      <div className="px-5 py-5 border-b border-white/[0.07] space-y-4">
        {items.map((item) => (
          <div key={item.ticketId} className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-zinc-200 font-medium leading-snug">{item.name}</p>
              {item.dayLabel && (
                <p className="text-xs text-zinc-500 mt-0.5">{item.dayLabel}</p>
              )}
              <p className="text-xs text-zinc-600 mt-1">
                {formatPrice(item.resalePrice, item.currency)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold text-zinc-100 tabular-nums shrink-0" style={{ letterSpacing: "-0.015em" }}>
              {formatPrice(item.resalePrice * item.quantity, item.currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Fee breakdown — transparency builds trust */}
      <div className="px-5 py-4 border-b border-white/[0.07] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Subtotal</span>
          <span className="text-xs text-zinc-300 tabular-nums">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Service fee</span>
          <span className="text-xs text-zinc-300">€0.00</span>
        </div>
        <p className="text-[10px] text-zinc-700 pt-0.5">No hidden charges — all fees included in ticket price</p>
      </div>

      {/* TOTAL — the dominant number on the page */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-zinc-300">Total due</span>
          <span
            className="font-bold text-white tabular-nums"
            style={{ fontSize: "2.25rem", letterSpacing: "-0.035em", lineHeight: 1 }}
          >
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5">Charged in EUR · Powered by Stripe</p>
      </div>

      {/* Security indicators */}
      <div className="px-5 py-5 border-b border-white/[0.07] space-y-2.5">
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Lock   className="w-3 h-3 shrink-0 text-zinc-600" />
          <span className="text-xs">256-bit SSL — payment data is encrypted end-to-end</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Shield className="w-3 h-3 shrink-0 text-zinc-600" />
          <span className="text-xs">PCI DSS Level 1 certified payment processing</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Check  className="w-3 h-3 shrink-0 text-zinc-600" />
          <span className="text-xs">Ticket delivered to your inbox immediately</span>
        </div>
      </div>

      {/* Payment badges + refund policy */}
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: "VISA",  cls: "text-[#1A1F71]/80 border-[#1A1F71]/30 bg-white/[0.04]" },
            { label: "MC",    cls: "text-[#EB001B]/70 border-[#EB001B]/20 bg-white/[0.04]" },
            { label: "AMEX",  cls: "text-[#007BC1]/70 border-[#007BC1]/20 bg-white/[0.04]" },
            { label: "BTC",   cls: "text-[#F7931A]/70 border-[#F7931A]/20 bg-white/[0.04]" },
            { label: "ETH",   cls: "text-[#627EEA]/70 border-[#627EEA]/20 bg-white/[0.04]" },
          ].map(({ label, cls }) => (
            <span
              key={label}
              className={`text-[9px] font-bold border rounded px-1.5 py-0.5 leading-none ${cls}`}
            >
              {label}
            </span>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 leading-relaxed">
          Free cancellation within 24 hours of purchase. After that, all sales are final per our resale terms.
        </p>
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();

  const [isLoading,      setIsLoading]      = useState(false);
  const [error,          setError]          = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [paymentMethod,  setPaymentMethod]  = useState<"card" | "crypto">("card");
  const [paymentState,   setPaymentState]   = useState<"idle" | "processing" | "success">("idle");

  // Card fields
  const [cardNumber,      setCardNumber]      = useState("");
  const [cardExpiry,      setCardExpiry]      = useState("");
  const [cardCvc,         setCardCvc]         = useState("");
  const [cardName,        setCardName]        = useState("");
  const [cardNumberError, setCardNumberError] = useState<string | null>(null);
  const [cardExpiryError, setCardExpiryError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Reactively pass contact values to StaticCryptoCheckout as the user types
  const watchedName  = watch("name")  ?? "";
  const watchedEmail = watch("email") ?? "";

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits    = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digits.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    if (digits.length === 16) setCardNumberError(luhn(digits) ? null : "Invalid card number");
    else if (cardNumberError)  setCardNumberError(null);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits    = e.target.value.replace(/\D/g, "").slice(0, 4);
    const formatted = digits.length >= 3 ? digits.slice(0, 2) + " / " + digits.slice(2) : digits;
    setCardExpiry(formatted);
    if (digits.length === 4) setCardExpiryError(validateExpiry(formatted));
    else if (cardExpiryError) setCardExpiryError(null);
  };

  // Submit handler — card only (crypto pays via QR scan, no form submit needed)
  const onSubmit = async (data: FormValues) => {
    // Crypto tab active: ignore form submission
    if (paymentMethod === "crypto") return;

    // Card: validate card fields
    if (!luhn(cardNumber))     { setError("Please enter a valid card number."); return; }
    const expErr = validateExpiry(cardExpiry);
    if (expErr)                { setError(expErr); return; }
    if (cardCvc.length < 3)    { setError("Please enter your CVV."); return; }
    if (!cardName.trim())      { setError("Please enter the name on your card."); return; }

    setError("");
    setIsLoading(true);
    setPaymentState("processing");

    // Save lead (fire-and-forget)
    fetch("/api/checkout/order", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        items:       items.map((i) => ({ ticketId: i.ticketId, quantity: i.quantity, unitPrice: i.resalePrice })),
        totalAmount: total,
        currency:    "EUR",
        guestName:   data.name,
        guestEmail:  data.email,
      }),
    }).catch(() => {});

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
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
      setPaymentState("idle");
    }
  };

  // ── Empty cart ─────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <header className="border-b border-white/[0.07] px-6">
          <div className="max-w-5xl mx-auto h-14 flex items-center">
            <p className="text-sm font-semibold text-zinc-100">Awakenings</p>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-4">Your cart is empty.</p>
            <button
              onClick={() => router.push("/tickets")}
              className="text-sm text-[#C9A84C] hover:underline transition-colors"
            >
              Browse tickets →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Minimal header ─────────────────────────────────────────── */}
      <header className="border-b border-white/[0.07] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
          {/* Back navigation — exit path without cluttering the flow */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <p className="text-sm font-semibold text-zinc-100 absolute left-1/2 -translate-x-1/2">
            Checkout
          </p>

          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Lock className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Secure</span>
          </div>
        </div>
      </header>

      {/* ── Two-column layout ──────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start"
        >

          {/* ── LEFT: form ─────────────────────────────────────────── */}
          <div className="space-y-8">

            {/* ── Contact ────────────────────────────────────────── */}
            <section>
              <h2 className={SECTION}>Contact information</h2>
              <div className="space-y-5">

                <div>
                  <label className={LABEL}>Full name</label>
                  <input
                    {...register("name")}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={INPUT}
                  />
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className={LABEL}>Email address</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={INPUT}
                  />
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
                  )}
                  <p className="mt-2 text-xs text-zinc-600">
                    Your ticket will be sent to this address
                  </p>
                </div>

                <div>
                  <label className={LABEL}>
                    Phone
                    <span className="ml-1.5 font-normal text-zinc-600 normal-case tracking-normal">
                      — optional
                    </span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+31 6 00000000"
                    autoComplete="tel"
                    className={INPUT}
                  />
                </div>

              </div>
            </section>

            {/* Divider */}
            <div className="h-px bg-white/[0.07]" />

            {/* ── Payment ────────────────────────────────────────── */}
            <section>
              <h2 className={SECTION}>Payment</h2>

              {/* Method selector */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={[
                    "flex items-center justify-center gap-2 py-3 rounded-lg border",
                    "text-sm font-medium transition-all duration-150",
                    paymentMethod === "card"
                      ? "border-[#C9A84C]/45 bg-[#C9A84C]/[0.07] text-[#C9A84C]"
                      : "border-white/[0.1] text-zinc-500 hover:border-white/[0.18] hover:text-zinc-200",
                  ].join(" ")}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={[
                    "flex items-center justify-center gap-2 py-3 rounded-lg border",
                    "text-sm font-medium transition-all duration-150",
                    paymentMethod === "crypto"
                      ? "border-[#C9A84C]/45 bg-[#C9A84C]/[0.07] text-[#C9A84C]"
                      : "border-white/[0.1] text-zinc-500 hover:border-white/[0.18] hover:text-zinc-200",
                  ].join(" ")}
                >
                  <Bitcoin className="w-4 h-4" />
                  Crypto
                </button>
              </div>

              {/* ── Card form ──────────────────────────────────── */}
              {paymentMethod === "card" && (
                <div className="space-y-5">

                  {/* Card number */}
                  <div>
                    <label className={LABEL}>Card number</label>
                    <div className="relative">
                      <input
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        onBlur={() => {
                          const d = cardNumber.replace(/\s/g, "");
                          if (d.length > 0) setCardNumberError(luhn(d) ? null : "Invalid card number");
                        }}
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        className={[
                          INPUT, "pr-24 tracking-widest",
                          cardNumberError  ? "!border-red-500/50" : "",
                          luhn(cardNumber) ? "!border-emerald-500/40" : "",
                        ].join(" ")}
                      />
                      {/* Card brand — active brand brightens, others fade */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 select-none">
                        {(["VISA", "MC", "AMEX"] as const).map((b) => {
                          const active = getCardBrand(cardNumber) === b;
                          return (
                            <span
                              key={b}
                              className={[
                                "text-[9px] font-bold border rounded px-1 py-0.5 leading-none transition-colors",
                                active
                                  ? "text-white border-white/30"
                                  : "text-zinc-700 border-zinc-800",
                              ].join(" ")}
                            >
                              {b}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    {cardNumberError && (
                      <p className="mt-2 text-xs text-red-400">{cardNumberError}</p>
                    )}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>Expiry date</label>
                      <input
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        onBlur={() => {
                          if (cardExpiry) setCardExpiryError(validateExpiry(cardExpiry));
                        }}
                        placeholder="MM / YY"
                        maxLength={7}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        className={[
                          INPUT,
                          cardExpiryError ? "!border-red-500/50" : "",
                          cardExpiry.replace(/[\s/]/g, "").length === 4 && !cardExpiryError
                            ? "!border-emerald-500/40" : "",
                        ].join(" ")}
                      />
                      {cardExpiryError && (
                        <p className="mt-2 text-xs text-red-400">{cardExpiryError}</p>
                      )}
                    </div>
                    <div>
                      <label className={LABEL}>Security code</label>
                      <input
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        placeholder="CVV"
                        maxLength={4}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        className={INPUT}
                      />
                    </div>
                  </div>

                  {/* Name on card */}
                  <div>
                    <label className={LABEL}>Name on card</label>
                    <input
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="As it appears on the card"
                      autoComplete="cc-name"
                      className={INPUT}
                    />
                  </div>

                </div>
              )}

              {/* ── Crypto: show immediately on tab selection ──────
                  watchedName / watchedEmail are reactive — update in
                  real time as the user types in the contact section.
                  StaticCryptoCheckout shows its own inline form when
                  name/email are still empty. */}
              {paymentMethod === "crypto" && (
                <StaticCryptoCheckout
                  fiatAmount={total}
                  cartItems={items}
                  customerName={watchedName}
                  customerEmail={watchedEmail}
                />
              )}
            </section>

            {/* Turnstile + error + CTA — card payment only */}
            {paymentMethod === "card" && (
              <>
                <Turnstile
                  onToken={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                />

                {error && (
                  <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] px-4 py-3.5">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !turnstileToken}
                  className={[
                    "w-full h-14 flex items-center justify-center gap-2.5 rounded-xl",
                    "text-base font-bold text-black transition-all duration-150",
                    "bg-[#C9A84C] hover:bg-[#D4B855]",
                    "shadow-[0_2px_16px_rgba(201,168,76,0.2)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "active:scale-[0.99]",
                  ].join(" ")}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-black/50" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Pay {formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-zinc-600 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3 shrink-0" />
                  Secured by Stripe · 256-bit SSL · PCI DSS Level 1
                </p>
              </>
            )}

          </div>

          {/* ── RIGHT: sticky order summary ────────────────────────── */}
          <div className="hidden md:block md:sticky md:top-8">
            <OrderSummary items={items} total={total} />
          </div>

          {/* Mobile: order summary below form */}
          <div className="block md:hidden">
            <OrderSummary items={items} total={total} />
          </div>

        </form>
      </main>
    </div>
  );
}
