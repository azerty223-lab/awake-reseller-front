"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Clock, Mail, Tag, Edit3,
  Truck, ArrowRight, Loader2, AlertCircle,
  Shield, Phone,
} from "lucide-react";
import { formatPrice } from "@/backend/lib/utils";

/* ── Types ─────────────────────────────────────────────────────── */
interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  ticket: {
    name: string;
    dayLabel: string | null;
    deliveryMethod: "DIGITAL" | "PHYSICAL" | "NAME_CHANGE";
  };
}

interface Order {
  id: string;
  orderNumber: string;
  guestEmail: string | null;
  guestName: string | null;
  totalAmount: number;
  currency: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

/* ── Delivery step sets ─────────────────────────────────────────── */
function getNextSteps(
  order: Order
): { icon: React.ReactNode; title: string; body: string }[] {
  const email     = order.guestEmail ?? "your email";
  const hasDigital     = order.orderItems.some(i => i.ticket.deliveryMethod === "DIGITAL");
  const hasNameChange  = order.orderItems.some(i => i.ticket.deliveryMethod === "NAME_CHANGE");
  const hasPhysical    = order.orderItems.some(i => i.ticket.deliveryMethod === "PHYSICAL");

  const steps = [];

  steps.push({
    icon:  <Mail className="w-4 h-4" aria-hidden="true" />,
    title: "Check your inbox",
    body:  `A payment confirmation has been sent to ${email}. Check your spam folder if it doesn't arrive within a few minutes.`,
  });

  if (hasDigital) {
    steps.push({
      icon:  <Tag className="w-4 h-4" aria-hidden="true" />,
      title: "Your e-ticket is being prepared",
      body:  "Digital tickets are sent to your email within 2 hours of payment confirmation. No name change required — your ticket is gate-ready.",
    });
  }

  if (hasNameChange) {
    steps.push({
      icon:  <Edit3 className="w-4 h-4" aria-hidden="true" />,
      title: "Name transfer initiated",
      body:  "We will submit your name change through the official Awakenings transfer portal within 24 hours. Your personalised e-ticket will arrive by 8 July 2026.",
    });
  }

  if (hasPhysical) {
    steps.push({
      icon:  <Truck className="w-4 h-4" aria-hidden="true" />,
      title: "Physical ticket dispatch",
      body:  "Your ticket will be shipped to your address within 2 business days. You will receive a tracking number by email.",
    });
  }

  steps.push({
    icon:  <Shield className="w-4 h-4" aria-hidden="true" />,
    title: "Buyer protection active",
    body:  "If your ticket is invalid at the gate, contact us within 24 hours of the event with a photo. We will resolve it or issue a full refund.",
  });

  return steps;
}

/* ── Component ──────────────────────────────────────────────────── */
export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = use(searchParams);
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error,   setError]   = useState(sessionId ? "" : "No session ID provided.");

  useEffect(() => {
    if (!sessionId) return;

    fetch(`/api/orders?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else            setOrder(data as Order);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your order. Your payment was still processed — check your email for confirmation.");
        setLoading(false);
      });
  }, [sessionId]);

  /* ── Loading ────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" aria-hidden="true" />
          <p className="text-sm text-zinc-500">Loading your order…</p>
        </div>
      </div>
    );
  }

  /* ── Error ──────────────────────────────────────────────────── */
  if (error) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center px-4">
        <div
          className="max-w-md w-full rounded-2xl p-8 text-center"
          style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h1 className="text-white font-semibold text-lg mb-2">Unable to load order</h1>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">{error}</p>
          <p className="text-zinc-600 text-xs mb-6">
            If your payment was successful, your confirmation email is proof of purchase.
            Contact us and we will locate your order manually.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="mailto:awtickets@outlook.com"
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-black"
              style={{ background: "#06B6D4" }}
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <Link
              href="/tickets"
              className="py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Back to tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const steps = order ? getNextSteps(order) : [];

  /* ── Success ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#030305] px-4 py-12">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(6,182,212,0.08)",
              border:     "1px solid rgba(6,182,212,0.25)",
              boxShadow:  "0 0 48px rgba(6,182,212,0.12)",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-[#06B6D4]" />
          </div>

          <h1 className="font-[var(--font-inter)] font-black text-3xl text-white mb-2"
              style={{ letterSpacing: "-0.025em" }}>
            Order confirmed
          </h1>
          <p className="text-zinc-500 text-sm">
            Thank you{order?.guestName ? `, ${order.guestName}` : ""}. Your payment was received.
          </p>
        </div>

        {/* ── Order summary card ───────────────────────────────── */}
        {order && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-600 mb-1">
                  Order reference
                </p>
                <p className="font-mono font-bold text-lg text-[#06B6D4]" style={{ letterSpacing: "0.04em" }}>
                  #{order.orderNumber.slice(-8).toUpperCase()}
                </p>
              </div>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(6,182,212,0.08)",
                  border:     "1px solid rgba(6,182,212,0.20)",
                  color:      "rgba(6,182,212,0.90)",
                }}
              >
                {order.status}
              </span>
            </div>

            {/* Line items */}
            <div
              className="px-6 py-5 space-y-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200 leading-snug">{item.ticket.name}</p>
                    {item.ticket.dayLabel && (
                      <p className="text-xs text-zinc-600 mt-0.5">{item.ticket.dayLabel}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {item.ticket.deliveryMethod === "DIGITAL" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                          <Tag className="w-3 h-3" aria-hidden="true" />Digital
                        </span>
                      )}
                      {item.ticket.deliveryMethod === "NAME_CHANGE" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-500/75">
                          <Edit3 className="w-3 h-3" aria-hidden="true" />Name transfer
                        </span>
                      )}
                      {item.ticket.deliveryMethod === "PHYSICAL" && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
                          <Truck className="w-3 h-3" aria-hidden="true" />Shipped
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <>
                          <span className="text-zinc-700 text-[10px]">·</span>
                          <span className="text-[10px] text-zinc-600">×{item.quantity}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 tabular-nums shrink-0" style={{ letterSpacing: "-0.015em" }}>
                    {formatPrice(item.unitPrice * item.quantity, order.currency)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-baseline justify-between px-6 py-5">
              <span className="text-sm font-semibold text-zinc-400">Total paid</span>
              <span
                className="font-bold text-white tabular-nums"
                style={{ fontSize: "1.75rem", letterSpacing: "-0.03em", lineHeight: 1 }}
              >
                {formatPrice(order.totalAmount, order.currency)}
              </span>
            </div>
          </div>
        )}

        {/* ── Delivery timeline ────────────────────────────────── */}
        {order?.guestEmail && (
          <div
            className="rounded-2xl px-6 py-5 flex items-start gap-3"
            style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.14)" }}
          >
            <Clock className="w-4 h-4 text-[#06B6D4] mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm text-zinc-300 leading-relaxed">
              Your ticket confirmation and delivery details are being sent to{" "}
              <strong className="text-white font-medium">{order.guestEmail}</strong>.
            </p>
          </div>
        )}

        {/* ── Next steps ───────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="px-6 pt-5 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-sm font-semibold text-white">What happens next</h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: "rgba(6,182,212,0.07)",
                    border:     "1px solid rgba(6,182,212,0.15)",
                    color:      "rgba(6,182,212,0.80)",
                  }}
                >
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-200 mb-0.5">{step.title}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Support ──────────────────────────────────────────── */}
        <div
          className="rounded-2xl px-6 py-5"
          style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <h2 className="text-sm font-semibold text-white mb-4">Need help?</h2>
          <div className="space-y-3">
            <a
              href="mailto:awtickets@outlook.com"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Mail className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#06B6D4] transition-colors" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">awtickets@outlook.com</p>
                <p className="text-[10px] text-zinc-600">Response within 4 hours</p>
              </div>
            </a>
            <a
              href="/contact"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <Phone className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#06B6D4] transition-colors" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">Contact form</p>
                <p className="text-[10px] text-zinc-600">Submit a ticket or question</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── Navigation ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/tickets"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Browse more tickets
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-black"
            style={{ background: "#06B6D4" }}
          >
            Back to home
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </div>
  );
}
