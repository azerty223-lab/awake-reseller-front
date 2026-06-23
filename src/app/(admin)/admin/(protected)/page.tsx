export const dynamic = "force-dynamic";

import { prisma } from "@/backend/lib/prisma";
import { formatPrice, formatDate } from "@/backend/lib/utils";
import { Badge } from "@/frontend/components/ui/Badge";
import { TrendingUp, Ticket, Package, Clock, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

async function getAnalytics() {
  const [
    totalRevenue,
    ticketsSold,
    inventoryLeft,
    pendingOrders,
    recentOrders,
    openInquiries,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { totalAmount: true },
    }),
    prisma.ticket.aggregate({ _sum: { sold: true } }),
    prisma.ticket.aggregate({
      where: { isVisible: true },
      _sum: { quantity: true, sold: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { orderItems: { include: { ticket: true } } },
    }),
    prisma.inquiry.count({ where: { status: "OPEN" } }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount ?? 0,
    ticketsSold: ticketsSold._sum.sold ?? 0,
    inventoryLeft:
      (inventoryLeft._sum.quantity ?? 0) - (inventoryLeft._sum.sold ?? 0),
    pendingOrders,
    recentOrders,
    openInquiries,
  };
}

const statusVariant: Record<string, "success" | "warning" | "info" | "error" | "default"> = {
  PAID: "success",
  PENDING: "warning",
  PROCESSING: "info",
  DELIVERED: "success",
  CANCELLED: "error",
  REFUNDED: "default",
};

export default async function AdminDashboard() {
  const data = await getAnalytics();

  const stats = [
    {
      label: "Total Revenue",
      value: formatPrice(data.totalRevenue),
      icon: TrendingUp,
      color: "#c9a84c",
      sub: "From paid orders",
    },
    {
      label: "Tickets Sold",
      value: data.ticketsSold.toString(),
      icon: Ticket,
      color: "#22c55e",
      sub: "Across all listings",
    },
    {
      label: "Inventory Left",
      value: data.inventoryLeft.toString(),
      icon: Package,
      color: "#3b82f6",
      sub: "Available tickets",
    },
    {
      label: "Pending Orders",
      value: data.pendingOrders.toString(),
      icon: Clock,
      color: "#f59e0b",
      sub: "Awaiting processing",
    },
  ];

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-500 text-sm">Awakenings Festival 2026 — Overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 hover:border-[#3a3a3a] transition-colors"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            <p className="text-zinc-500 text-xs font-medium">{label}</p>
            <p className="text-zinc-700 text-[10px] mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[#c9a84c] text-xs hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#1a1a1a]">
            {data.recentOrders.length === 0 ? (
              <p className="px-6 py-8 text-zinc-600 text-sm text-center">No orders yet</p>
            ) : (
              data.recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/2 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {order.guestName || order.guestEmail || "Guest"}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">
                      {order.orderItems.map((oi) => oi.ticket.name).join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[#c9a84c] font-bold text-sm">
                      {formatPrice(order.totalAmount, order.currency)}
                    </p>
                    <p className="text-zinc-600 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                  </div>
                  <Badge variant={statusVariant[order.status] ?? "default"} size="sm">
                    {order.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {/* Inquiries alert */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Open Inquiries</p>
                <p className="text-zinc-600 text-xs">Needs response</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-400 mb-2">{data.openInquiries}</p>
            <Link
              href="/admin/inquiries"
              className="text-amber-400 text-xs hover:underline flex items-center gap-1"
            >
              View inquiries <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5">
            <p className="text-white font-semibold text-sm mb-4">Quick Actions</p>
            <div className="space-y-2">
              <Link
                href="/admin/tickets"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-xs font-medium hover:bg-[#c9a84c]/20 transition-colors"
              >
                <Ticket className="w-3.5 h-3.5" />
                Manage Tickets
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#161616] border border-[#2a2a2a] text-zinc-400 text-xs font-medium hover:text-white hover:border-[#3a3a3a] transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                Process Orders
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#161616] border border-[#2a2a2a] text-zinc-400 text-xs font-medium hover:text-white hover:border-[#3a3a3a] transition-colors"
              >
                View Public Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
