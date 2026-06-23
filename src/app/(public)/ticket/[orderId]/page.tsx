import { notFound } from "next/navigation";
import { prisma } from "@/backend/lib/prisma";
import QRCode from "qrcode";
import { MapPin, Calendar, ExternalLink, Ticket } from "lucide-react";

export const dynamic = "force-dynamic";

const EVENT_URL = "https://www.awakenings.com/en/events/2026/07/awakenings-festival/378057/";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: { include: { ticket: true } } },
  });

  if (!order || order.status !== "DELIVERED") notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const ticketUrl = `${baseUrl}/ticket/${order.id}`;
  const qrSvg = await QRCode.toString(ticketUrl, { type: "svg", margin: 1, width: 220 });

  const ticketTypes = order.orderItems
    .map((oi) => `${oi.ticket.name}${oi.quantity > 1 ? ` ×${oi.quantity}` : ""}`)
    .join(" · ");

  const ref = order.orderNumber.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl shadow-black/60">

          {/* Header band */}
          <div className="bg-[#c9a84c] px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-black text-[10px] font-bold tracking-widest uppercase">Official Ticket</p>
              <p className="text-black text-lg font-black leading-tight">AW TICKETS</p>
            </div>
            <Ticket className="w-8 h-8 text-black/60" />
          </div>

          {/* Body */}
          <div className="px-6 pt-6 pb-2">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Your ticket for</p>
            <h1 className="text-white font-black text-xl leading-tight mb-5">
              Awakenings<br />Festival 2026
            </h1>

            {/* Event info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">July 10–12, 2026</p>
                  <p className="text-zinc-500 text-xs">12:00 → Jul 12 · 23:59</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#c9a84c]" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Hilvarenbeek</p>
                  <p className="text-zinc-500 text-xs">Hilvarenbeek Recreation Area, Netherlands</p>
                </div>
              </div>
            </div>

            {/* Attendee */}
            <div className="bg-[#0a0a0a] rounded-2xl p-4 mb-6 border border-[#2a2a2a]">
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-1">Attendee</p>
              <p className="text-white font-bold text-base">{order.guestName ?? "—"}</p>
              <p className="text-[#c9a84c] text-xs mt-1">{ticketTypes}</p>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="mx-6 border-t border-dashed border-[#2a2a2a] relative">
            <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-[#0a0a0a]" />
            <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-[#0a0a0a]" />
          </div>

          {/* QR section */}
          <div className="px-6 pt-6 pb-6 flex flex-col items-center">
            <div
              className="bg-white rounded-2xl p-3 mb-4"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
            <p className="text-zinc-500 text-xs font-mono tracking-widest mb-1">{ref}</p>
            <p className="text-zinc-700 text-[10px] text-center leading-relaxed">
              Present this QR code at the festival entrance.<br />Keep it accessible on your mobile device.
            </p>
          </div>
        </div>

        {/* Event page button */}
        <a
          href={EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-[#111111] border border-[#2a2a2a] text-zinc-400 text-sm font-medium hover:text-white hover:border-[#3a3a3a] transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Official Event Page
        </a>
      </div>
    </div>
  );
}
