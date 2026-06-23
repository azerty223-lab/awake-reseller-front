"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  ticket: { name: string };
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

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = use(searchParams);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    fetch(`/api/orders?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order details");
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/tickets" className="text-[#c9a84c] hover:underline">
            Back to tickets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-zinc-500 text-sm">
            Thank you{order?.guestName ? `, ${order.guestName}` : ""}! Your order has been placed.
          </p>
        </div>

        {/* Order details */}
        {order && (
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Order Number</p>
                <p className="text-[#c9a84c] font-mono font-bold text-lg mt-0.5">
                  #{order.orderNumber.slice(-8).toUpperCase()}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                {order.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-[#2a2a2a]">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    {item.ticket.name} × {item.quantity}
                  </span>
                  <span className="text-white">
                    {formatPrice(item.unitPrice * item.quantity, order.currency)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold">
              <span className="text-white">Total Paid</span>
              <span className="text-[#c9a84c] text-xl">
                {formatPrice(order.totalAmount, order.currency)}
              </span>
            </div>
          </div>
        )}

        {/* Next steps */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#c9a84c]" />
            What happens next?
          </h3>
          <ol className="space-y-3 text-sm text-zinc-400">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>We initiate the ticket name transfer process within 24 hours.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>You'll receive a confirmation email once the transfer is complete.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Your personalized e-ticket arrives in your inbox (3–5 business days).</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/tickets"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#2a2a2a] text-zinc-400 text-sm font-medium hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all"
          >
            Browse more tickets
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c9a84c] text-black text-sm font-semibold hover:bg-[#e8c05a] transition-colors"
          >
            Back to home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
