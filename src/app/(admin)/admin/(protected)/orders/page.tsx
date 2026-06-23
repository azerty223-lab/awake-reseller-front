"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice, formatDate } from "@/backend/lib/utils";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { CheckCircle, RefreshCw, Loader2, Send } from "lucide-react";

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
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "PROCESSING", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

const statusVariant: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
  PAID: "success",
  PENDING: "warning",
  PROCESSING: "info",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "default",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadOrders = useCallback(async (status: string) => {
    const url = status === "ALL" ? "/api/orders" : `/api/orders?status=${status}`;
    const res = await fetch(url);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      setOrders(await loadOrders(filter));
    } finally {
      setLoading(false);
    }
  }, [filter, loadOrders]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await loadOrders(filter);
        if (!cancelled) setOrders(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [filter, loadOrders]);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const payload: Record<string, unknown> = { status };
    if (status === "DELIVERED") payload.deliveredAt = new Date().toISOString();
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
      const res = await fetch(`/api/orders/${id}/send-ticket`, { method: "POST" });
      const data = await res.json() as { success?: boolean; delivered?: boolean; emailError?: string; ticketUrl?: string };
      if (res.status === 207) {
        alert(`Order marked as Delivered, but email failed:\n${data.emailError}\n\nTicket URL: ${data.ticketUrl}`);
      } else if (!res.ok) {
        alert((data as { error?: string }).error ?? "Failed to send ticket");
      } else {
        alert("Ticket sent successfully — order marked as Delivered.");
      }
    } catch {
      alert("Request failed. Check your connection.");
    }
    setUpdating(null);
    fetchOrders();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Orders</h1>
          <p className="text-zinc-500 text-sm">{orders.length} orders</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchOrders} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setLoading(true);
              setFilter(s);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? "bg-[#c9a84c] text-black"
                : "bg-[#111111] border border-[#2a2a2a] text-zinc-400 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

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
                  {["Order", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4">
                      <p className="text-[#c9a84c] font-mono text-xs font-bold">
                        #{order.orderNumber.slice(-8).toUpperCase()}
                      </p>
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
                      <p className="text-zinc-500 text-xs">{formatDate(order.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => confirmPayment(order.id)}
                            disabled={updating === order.id}
                            className="px-2.5 py-1.5 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-[#c9a84c] text-xs font-medium hover:bg-[#c9a84c]/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Confirm Payment
                          </button>
                        )}
                        {(order.status === "PAID" || order.status === "PROCESSING") && (
                          <button
                            onClick={() => sendTicket(order.id)}
                            disabled={updating === order.id}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Send Ticket
                          </button>
                        )}
                        {(order.status === "PAID" || order.status === "PROCESSING") && (
                          <button
                            onClick={() => updateStatus(order.id, "CANCELLED")}
                            disabled={updating === order.id}
                            className="px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-12">No orders found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
