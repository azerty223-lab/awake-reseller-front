"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/backend/lib/utils";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import {
  Eye, EyeOff, Star, StarOff, Pencil, Trash2, Plus, Loader2, RefreshCw
} from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@prisma/client";
import { TicketCategory } from "@prisma/client";

const categoryVariant: Record<TicketCategory, "gold" | "info" | "success" | "purple" | "rose" | "default"> = {
  WEEKEND: "gold",
  SATURDAY: "info",
  SUNDAY: "info",
  CAMPING: "success",
  COMFORT_CAMPING: "success",
  CAR_CAMPING: "success",
  PREMIUM: "purple",
  ACCOMMODATION: "rose",
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/tickets");
    const data = await res.json();
    setTickets(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const toggle = async (id: string, field: "isVisible" | "isFeatured", current: boolean) => {
    await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    fetchTickets();
  };

  const deleteTicket = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/tickets/${id}`, { method: "DELETE" });
    fetchTickets();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tickets</h1>
          <p className="text-zinc-500 text-sm">{tickets.length} listings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={fetchTickets} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Link href="/admin/tickets/new/edit">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Ticket
            </Button>
          </Link>
        </div>
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
                  {["Name", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-white font-medium text-sm">{ticket.name}</p>
                        {ticket.dayLabel && (
                          <p className="text-zinc-600 text-xs mt-0.5">{ticket.dayLabel}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={categoryVariant[ticket.category]} size="sm">
                        {ticket.category.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-[#c9a84c] font-bold text-sm">
                        {formatPrice(ticket.resalePrice, ticket.currency)}
                      </p>
                      <p className="text-zinc-600 text-xs line-through">
                        {formatPrice(ticket.originalPrice, ticket.currency)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white text-sm">
                        {ticket.sold}/{ticket.quantity}
                      </p>
                      <p className="text-zinc-600 text-xs">sold/total</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1.5">
                        <Badge variant={ticket.isVisible ? "success" : "default"} size="sm">
                          {ticket.isVisible ? "Visible" : "Hidden"}
                        </Badge>
                        {ticket.isFeatured && (
                          <Badge variant="gold" size="sm">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggle(ticket.id, "isVisible", ticket.isVisible)}
                          title={ticket.isVisible ? "Hide" : "Show"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                        >
                          {ticket.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => toggle(ticket.id, "isFeatured", ticket.isFeatured)}
                          title={ticket.isFeatured ? "Unfeature" : "Feature"}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-all"
                        >
                          {ticket.isFeatured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                        </button>
                        <Link href={`/admin/tickets/${ticket.id}/edit`}>
                          <button
                            title="Edit"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => deleteTicket(ticket.id, ticket.name)}
                          title="Delete"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tickets.length === 0 && (
              <p className="text-zinc-600 text-sm text-center py-12">No tickets found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
