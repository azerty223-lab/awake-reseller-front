"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/frontend/store/cart";
import { formatPrice } from "@/backend/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import Link from "next/link";
import {
  User, Mail, Phone, CreditCard, Calendar, KeyRound,
  UserRound, Lock, Shield, Bitcoin, Check, ArrowLeft,
} from "lucide-react";
import {
  FaCcVisa, FaCcMastercard, FaCcAmex,
  FaBitcoin, FaEthereum,
} from "react-icons/fa";
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
  if (/^4/.test(n))                return "VISA";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "MC";
  if (/^3[47]/.test(n))            return "AMEX";
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

const INPUT_BASE = [
  "w-full py-3 rounded-lg text-sm text-zinc-100",
  "bg-[#111113] border border-white/[0.1] placeholder-zinc-700",
  "focus:outline-none focus:border-[#06B6D4]/55 focus:ring-1 focus:ring-[#06B6D4]/[0.09]",
  "transition-all duration-150",
].join(" ");

// Input without icon — full left padding
const INPUT = `${INPUT_BASE} px-4`;

// Input with left icon — extra left padding to clear the icon
const INPUT_ICON = `${INPUT_BASE} pl-10 pr-4`;

const LABEL = "block text-xs font-medium text-zinc-400 mb-2";
const SECTION = "text-sm font-semibold text-zinc-100 mb-5";

// ── Reusable: field wrapper with an icon on the left ───────────────────────

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600">
      {children}
    </span>
  );
}

// ── Order summary ───────────────────────────────────────────────────────────

interface SummaryItem {
  ticketId:    string;
  name:        string;
  dayLabel?:   string | null;
  resalePrice: number;
  currency:    string;
  quantity:    number;
}

/* Payment brand icons — sized and coloured per brand guidelines */
function PaymentIcons() {
  return (
    <div className="flex items-center gap-2 flex-wrap" aria-label="Accepted payment methods">
      <FaCcVisa
        size={28}
        style={{ color: "#1A1F71" }}
        title="Visa"
        aria-label="Visa"
      />
      <FaCcMastercard
        size={28}
        style={{ color: "#EB001B" }}
        title="Mastercard"
        aria-label="Mastercard"
      />
      <FaCcAmex
        size={28}
        style={{ color: "#007BC1" }}
        title="American Express"
        aria-label="American Express"
      />
      <FaBitcoin
        size={22}
        style={{ color: "#F7931A" }}
        title="Bitcoin"
        aria-label="Bitcoin"
      />
      <FaEthereum
        size={22}
        style={{ color: "#627EEA" }}
        title="Ethereum"
        aria-label="Ethereum"
      />
    </div>
  );
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
            <p className="text-sm font-semibold text-zinc-100 tabular-nums shrink-0"
               style={{ letterSpacing: "-0.015em" }}>
              {formatPrice(item.resalePrice * item.quantity, item.currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Fee breakdown */}
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

      {/* Total */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold text-zinc-300">Total due</span>
          <span className="font-bold text-white tabular-nums"
                style={{ fontSize: "2.25rem", letterSpacing: "-0.035em", lineHeight: 1 }}>
            {formatPrice(total)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-600 mt-1.5">Charged in EUR · Powered by Stripe</p>
      </div>

      {/* Security indicators */}
      <div className="px-5 py-5 border-b border-white/[0.07] space-y-2.5">
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Lock   className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
          <span className="text-xs">256-bit SSL — payment data is encrypted end-to-end</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Shield className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
          <span className="text-xs">PCI DSS Level 1 certified payment processing</span>
        </div>
        <div className="flex items-center gap-2.5 text-zinc-500">
          <Check  className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
          <span className="text-xs">Ticket delivered to your inbox immediately</span>
        </div>
      </div>

      {/* Payment brand icons + refund policy */}
      <div className="px-5 py-4 space-y-3">
        <PaymentIcons />
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
  const [consentChecked, setConsentChecked] = useState(false);
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

  const onSubmit = async (data: FormValues) => {
    if (paymentMethod === "crypto") return;

    if (!luhn(cardNumber))  { setError("Please enter a valid card number."); return; }
    const expErr = validateExpiry(cardExpiry);
    if (expErr)             { setError(expErr); return; }
    if (cardCvc.length < 3) { setError("Please enter your CVV."); return; }
    if (!cardName.trim())   { setError("Please enter the name on your card."); return; }

    setError("");
    setIsLoading(true);
    setPaymentState("processing");

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
              className="text-sm text-[#06B6D4] hover:underline transition-colors"
            >
              Browse tickets →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active card brand icon shown inside the card-number field ─────────

  const activeBrand = getCardBrand(cardNumber);

  const brandIcons = {
    VISA: <FaCcVisa  size={20} style={{ color: "#1A1F71", opacity: 1    }} aria-label="Visa"             />,
    MC:   <FaCcMastercard size={20} style={{ color: "#EB001B", opacity: 1 }} aria-label="Mastercard"    />,
    AMEX: <FaCcAmex  size={20} style={{ color: "#007BC1", opacity: 1    }} aria-label="American Express" />,
  };

  // ── Main ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ── Minimal header ─────────────────────────────────────────── */}
      <header className="border-b border-white/[0.07] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
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

            {/* ── Contact information ──────────────────────────────── */}
            <section>
              <h2 className={SECTION}>Contact information</h2>
              <div className="space-y-5">

                {/* Full name */}
                <div>
                  <label className={LABEL} htmlFor="name">Full name</label>
                  <div className="relative">
                    <FieldIcon>
                      <User className="w-4 h-4" aria-hidden="true" />
                    </FieldIcon>
                    <input
                      id="name"
                      {...register("name")}
                      placeholder="Your full name"
                      autoComplete="name"
                      className={INPUT_ICON}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-xs text-red-400">{errors.name.message}</p>
                  )}
                </div>

                {/* Email address */}
                <div>
                  <label className={LABEL} htmlFor="email">Email address</label>
                  <div className="relative">
                    <FieldIcon>
                      <Mail className="w-4 h-4" aria-hidden="true" />
                    </FieldIcon>
                    <input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="you@email.com"
                      autoComplete="email"
                      className={INPUT_ICON}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-xs text-red-400">{errors.email.message}</p>
                  )}
                  <p className="mt-2 text-xs text-zinc-600">
                    Your ticket will be sent to this address
                  </p>
                </div>

                {/* Phone — optional */}
                <div>
                  <label className={LABEL} htmlFor="phone">
                    Phone
                    <span className="ml-1.5 font-normal text-zinc-600 normal-case tracking-normal">
                      — optional
                    </span>
                  </label>
                  <div className="relative">
                    <FieldIcon>
                      <Phone className="w-4 h-4" aria-hidden="true" />
                    </FieldIcon>
                    <input
                      id="phone"
                      {...register("phone")}
                      type="tel"
                      placeholder="+31 6 00000000"
                      autoComplete="tel"
                      className={INPUT_ICON}
                    />
                  </div>
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
                      ? "border-[#06B6D4]/45 bg-[#06B6D4]/[0.07] text-[#06B6D4]"
                      : "border-white/[0.1] text-zinc-500 hover:border-white/[0.18] hover:text-zinc-200",
                  ].join(" ")}
                >
                  <CreditCard className="w-4 h-4" aria-hidden="true" />
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={[
                    "flex items-center justify-center gap-2 py-3 rounded-lg border",
                    "text-sm font-medium transition-all duration-150",
                    paymentMethod === "crypto"
                      ? "border-[#06B6D4]/45 bg-[#06B6D4]/[0.07] text-[#06B6D4]"
                      : "border-white/[0.1] text-zinc-500 hover:border-white/[0.18] hover:text-zinc-200",
                  ].join(" ")}
                >
                  <Bitcoin className="w-4 h-4" aria-hidden="true" />
                  Crypto
                </button>
              </div>

              {/* ── Card form ──────────────────────────────────────── */}
              {paymentMethod === "card" && (
                <div className="space-y-5">

                  {/* Card number + live brand icon */}
                  <div>
                    <label className={LABEL} htmlFor="cc-number">Card number</label>
                    <div className="relative">
                      {/* Left: card icon */}
                      <FieldIcon>
                        <CreditCard className="w-4 h-4" aria-hidden="true" />
                      </FieldIcon>

                      <input
                        id="cc-number"
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
                          INPUT_ICON, "pr-12 tracking-widest",
                          cardNumberError  ? "!border-red-500/50" : "",
                          luhn(cardNumber) ? "!border-emerald-500/40" : "",
                        ].join(" ")}
                      />

                      {/* Right: detected brand icon (fades in when detected) */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none">
                        {activeBrand ? (
                          <span className="transition-opacity duration-150">
                            {brandIcons[activeBrand]}
                          </span>
                        ) : (
                          /* Show all three faded when no brand is detected */
                          <span className="flex gap-1 opacity-25">
                            <FaCcVisa      size={18} style={{ color: "#fff" }} aria-hidden="true" />
                            <FaCcMastercard size={18} style={{ color: "#fff" }} aria-hidden="true" />
                            <FaCcAmex      size={18} style={{ color: "#fff" }} aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </div>
                    {cardNumberError && (
                      <p className="mt-2 text-xs text-red-400">{cardNumberError}</p>
                    )}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL} htmlFor="cc-exp">Expiry date</label>
                      <div className="relative">
                        <FieldIcon>
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                        </FieldIcon>
                        <input
                          id="cc-exp"
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
                            INPUT_ICON,
                            cardExpiryError ? "!border-red-500/50" : "",
                            cardExpiry.replace(/[\s/]/g, "").length === 4 && !cardExpiryError
                              ? "!border-emerald-500/40" : "",
                          ].join(" ")}
                        />
                      </div>
                      {cardExpiryError && (
                        <p className="mt-2 text-xs text-red-400">{cardExpiryError}</p>
                      )}
                    </div>

                    <div>
                      <label className={LABEL} htmlFor="cc-cvc">Security code</label>
                      <div className="relative">
                        <FieldIcon>
                          <KeyRound className="w-4 h-4" aria-hidden="true" />
                        </FieldIcon>
                        <input
                          id="cc-cvc"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="CVV"
                          maxLength={4}
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          className={INPUT_ICON}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name on card */}
                  <div>
                    <label className={LABEL} htmlFor="cc-name">Name on card</label>
                    <div className="relative">
                      <FieldIcon>
                        <UserRound className="w-4 h-4" aria-hidden="true" />
                      </FieldIcon>
                      <input
                        id="cc-name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="As it appears on the card"
                        autoComplete="cc-name"
                        className={INPUT_ICON}
                      />
                    </div>
                  </div>

                </div>
              )}

              {/* ── Crypto ─────────────────────────────────────────── */}
              {paymentMethod === "crypto" && (
                <StaticCryptoCheckout
                  fiatAmount={total}
                  cartItems={items}
                  customerName={watchedName}
                  customerEmail={watchedEmail}
                />
              )}
            </section>

            {/* ── Turnstile + consent + submit — card only ─────────── */}
            {paymentMethod === "card" && (
              <>
                <Turnstile
                  onToken={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                />

                {/* Consent checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={[
                        "w-4 h-4 rounded border flex items-center justify-center transition-all duration-150",
                        consentChecked
                          ? "bg-[#06B6D4] border-[#06B6D4]"
                          : "bg-transparent border-white/[0.20] group-hover:border-white/[0.35]",
                      ].join(" ")}
                    >
                      {consentChecked && (
                        <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} aria-hidden="true" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    I have read and agree to the{" "}
                    <Link href="/about#terms"
                      className="text-zinc-300 hover:text-[#06B6D4] underline underline-offset-2 transition-colors">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/about#privacy"
                      className="text-zinc-300 hover:text-[#06B6D4] underline underline-offset-2 transition-colors">
                      Privacy Policy
                    </Link>
                    . I understand all sales are final once the ticket transfer process has been initiated.
                  </span>
                </label>

                {error && (
                  <div className="rounded-lg border border-red-500/25 bg-red-500/[0.06] px-4 py-3.5">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !turnstileToken || !consentChecked}
                  className={[
                    "w-full h-14 flex items-center justify-center gap-2.5 rounded-xl",
                    "text-base font-bold text-black transition-all duration-150",
                    "bg-[#06B6D4] hover:bg-[#22D3EE]",
                    "shadow-[0_2px_16px_rgba(6,182,212,0.2)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "active:scale-[0.99]",
                  ].join(" ")}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin text-black/50" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10"
                                stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" aria-hidden="true" />
                      Pay {formatPrice(total)}
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-zinc-600 flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3 shrink-0" aria-hidden="true" />
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
