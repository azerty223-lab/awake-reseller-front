"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice, formatDate } from "@/backend/lib/utils";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { CheckCircle, RefreshCw, Loader2, Send, AlertCircle } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  ticket: { name: string; deliveryMethod: string };
}

interface Order {
  id: string;
  orderNumber: string;
  guestEmail: string | null;
  guestName: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  deliveredAt?: string | null;
  orderItems: OrderItem[];
}

/* All selectable status filters, plus the synthetic "NEEDS_ACTION" view */
const STATUS_OPTIONS = [
  { value: "NEEDS_ACTION", label: "Needs Action" },
  { value: "ALL",          label: "All" },
  { value: "PENDING",      label: "Pending" },
  { value: "PAID",         label: "Paid" },
  { value: "PROCESSING",   label: "Processing" },
  { value: "DELIVERED",    label: "Delivered" },
  { value: "CANCELLED",    label: "Cancelled" },
  { value: "REFUNDED",     label: "Refunded" },
] as const;

const statusVariant: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
  PAID:       "success",
  PENDING:    "warning",
  PROCESSING: "info",
  DELIVERED:  "success",
  CANCELLED:  "error",
  REFUNDED:   "default",
};

export default function AdminOrdersPage() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState<string>("NEEDS_ACTION");
  const [updating,  setUpdating]  = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/orders");
      const data = await res.json();
      setAllOrders(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchOrders(); }, [fetchOrders]);

  /* Derive the visible set from the single-source allOrders list */
  const orders = (() => {
    if (filter === "NEEDS_ACTION") {
      // Paid orders that have NOT been delivered yet — oldest first (highest urgency)
      return [...allOrders]
        .filter(o => o.status === "PAID" || o.status === "PROCESSING")
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    if (filter === "ALL") return allOrders;
    return allOrders.filter(o => o.status === filter);
  })();

  const needsActionCount = allOrders.filter(
    o => o.status === "PAID" || o.status === "PROCESSING"
  ).length;

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const payload: Record<string, unknown> = { status };
    if (status === "DELIVERED") payload.deliveredAt = new Date().toISOString();
    await fetch(`/api/orders/${id}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    setUpdating(null);
    fetchOrders();
  };

  const confirmPayment = async (id: string) => {
    setUpdating(id);
    const res = await fetch(`/api/orders/${id}/fulfill`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      alert(data.error ?? "Failed to confirm payment");
    }
    setUpdating(null);
    fetchOrders();
  };

  const sendTicket = async (id: string) => {
    setUpdating(id);
    try {
      const res  = await fetch(`/api/orders/${id}/send-ticket`, { method: "POST" });
      const data = await res.json() as {
        success?: boolean;
        delivered?: boolean;
        emailError?: string;
        ticketUrl?: string;
        error?: string;
      };
      if (res.status === 207) {
        alert(`Order marked as Delivered, but email failed:\n${data.emailError}\n\nTicket URL: ${data.ticketUrl}`);
      } else if (!res.ok) {
        alert(data.error ?? "Failed to send ticket");
      } else {
        alert("Ticket sent — order marked as Delivered.");
      }
    } catch {
      alert("Request failed. Check your connection.");
    }
    setUpdating(null);
    fetchOrders();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
          <p className="text-zinc-500 text-sm">
            {allOrders.length} total
            {needsActionCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-400 font-semibold">
                <AlertCircle className="w-3 h-3" />
                {needsActionCount} need action
              </span>
            )}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchOrders} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {/* ── Status tabs ──────────────────────────────────────────── */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = filter === opt.value;
          const count = opt.value === "NEEDS_ACTION"
            ? needsActionCount
            : opt.value === "ALL"
              ? allOrders.length
              : allOrders.filter(o => o.status === opt.value).length;

          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={[
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5",
                isActive
                  ? opt.value === "NEEDS_ACTION"
                    ? "bg-amber-400 text-black"
                    : "bg-[#c9a84c] text-black"
                  : "bg-[#111111] border border-[#2a2a2a] text-zinc-400 hover:text-white",
              ].join(" ")}
            >
              {opt.label}
              {count > 0 && (
                <span className={[
                  "px-1.5 py-0.5 rounded text-[10px] font-bold leading-none",
                  isActive ? "bg-black/20 text-inherit" : "bg-white/[0.08] text-zinc-500",
                ].join(" ")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Needs-action banner ───────────────────────────────────── */}
      {filter === "NEEDS_ACTION" && needsActionCount > 0 && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 mb-5"
          style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.18)" }}
        >
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-400/90 leading-relaxed">
            <strong>{needsActionCount} order{needsActionCount !== 1 ? "s" : ""}</strong> are paid but tickets have not been delivered.
            Send tickets or mark them as Processing to acknowledge. Sorted oldest first.
          </p>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a]">
                  {["Order", "Customer", "Items", "Delivery", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {orders.map((order) => {
                  const isOldUnfulfilled = (order.status === "PAID" || order.status === "PROCESSING") &&
                    (Date.now() - new Date(order.createdAt).getTime()) > 2 * 60 * 60 * 1000; // > 2h

                  return (
                    <tr
                      key={order.id}
                      className={[
                        "hover:bg-white/[0.02] transition-colors",
                        isOldUnfulfilled ? "bg-amber-500/[0.03]" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-4">
                        <p className="text-[#c9a84c] font-mono text-xs font-bold">
                          #{order.orderNumber.slice(-8).toUpperCase()}
                        </p>
                        {isOldUnfulfilled && (
                          <span className="text-[10px] text-amber-400/70 font-medium">⚠ Overdue</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{order.guestName || "—"}</p>
                        <p className="text-zinc-600 text-xs mt-0.5">{order.guestEmail || "—"}</p>
                      </td>
                      <td className="px-4 py-4 max-w-[200px]">
                        <p className="text-zinc-400 text-xs truncate">
                          {order.orderItems.map((oi) => `${oi.ticket.name} ×${oi.quantity}`).join(", ")}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {order.orderItems.map((oi) => (
                          <p key={oi.id} className="text-zinc-500 text-xs">
                            {oi.ticket.deliveryMethod === "NAME_CHANGE"
                              ? "Name transfer"
                              : oi.ticket.deliveryMethod === "PHYSICAL"
                                ? "Physical"
                                : "Digital"}
                          </p>
                        ))}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[#c9a84c] font-bold text-sm">
                          {formatPrice(order.totalAmount, order.currency)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={statusVariant[order.status] ?? "default"} size="sm">
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-zinc-500 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {order.status === "PENDING" && (
                            <button
                              onClick={() => confirmPayment(order.id)}
                              disabled={updating === order.id}
                              className="px-2.5 py-1.5 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-medium hover:bg-[#c9a84c]/20 transition-colors disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Confirm Payment
                            </button>
                          )}
                          {(order.status === "PAID" || order.status === "PROCESSING") && (
                            <button
                              onClick={() => sendTicket(order.id)}
                              disabled={updating === order.id}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-1 whitespace-nowrap"
                            >
                              <Send className="w-3 h-3" />
                              Send Ticket
                            </button>
                          )}
                          {(order.status === "PAID" || order.status === "PROCESSING") && (
                            <button
                              onClick={() => updateStatus(order.id, "CANCELLED")}
                              disabled={updating === order.id}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                        {updating === order.id && (
                          <Loader2 className="w-3.5 h-3.5 text-zinc-500 animate-spin mt-1" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {orders.length === 0 && !loading && (
              <div className="text-center py-16">
                {filter === "NEEDS_ACTION" ? (
                  <>
                    <CheckCircle className="w-8 h-8 text-emerald-500/40 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm font-medium">All clear — no pending fulfillments</p>
                    <p className="text-zinc-700 text-xs mt-1">All paid orders have been delivered</p>
                  </>
                ) : (
                  <p className="text-zinc-600 text-sm">No orders found</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
