export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  TicketCategory,
  DeliveryMethod,
  PersonalizationStatus,
} from "@prisma/client";

async function updateTicket(id: string, formData: FormData) {
  "use server";
  const resalePrice = parseFloat(formData.get("resalePrice") as string);
  const originalPrice = parseFloat(formData.get("originalPrice") as string);
  const quantity = parseInt(formData.get("quantity") as string, 10);

  await prisma.ticket.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      dayLabel: (formData.get("dayLabel") as string) || null,
      category: formData.get("category") as TicketCategory,
      originalPrice,
      resalePrice,
      quantity,
      currency: (formData.get("currency") as string) || "EUR",
      deliveryMethod: formData.get("deliveryMethod") as DeliveryMethod,
      personalizationStatus: formData.get(
        "personalizationStatus"
      ) as PersonalizationStatus,
      isVisible: formData.get("isVisible") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    },
  });

  redirect("/admin/tickets");
}

export default async function EditTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) notFound();

  const update = updateTicket.bind(null, id);

  const categories = Object.values(TicketCategory);
  const deliveryMethods = Object.values(DeliveryMethod);
  const personalizationStatuses = Object.values(PersonalizationStatus);

  const field =
    "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]";
  const label = "block text-zinc-400 text-xs font-medium mb-1";

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Edit Ticket</h1>
        <p className="text-zinc-500 text-sm">{ticket.name}</p>
      </div>

      <form action={update} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={label}>Ticket Name</label>
            <input name="name" defaultValue={ticket.name} className={field} required />
          </div>

          <div className="col-span-2">
            <label className={label}>Description</label>
            <textarea
              name="description"
              defaultValue={ticket.description}
              rows={4}
              className={field}
              required
            />
          </div>

          <div>
            <label className={label}>Day Label</label>
            <input name="dayLabel" defaultValue={ticket.dayLabel ?? ""} className={field} />
          </div>

          <div>
            <label className={label}>Category</label>
            <select name="category" defaultValue={ticket.category} className={field}>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Original Price (€)</label>
            <input
              name="originalPrice"
              type="number"
              step="0.01"
              defaultValue={ticket.originalPrice}
              className={field}
              required
            />
          </div>

          <div>
            <label className={label}>Resale Price (€)</label>
            <input
              name="resalePrice"
              type="number"
              step="0.01"
              defaultValue={ticket.resalePrice}
              className={field}
              required
            />
          </div>

          <div>
            <label className={label}>Quantity</label>
            <input
              name="quantity"
              type="number"
              defaultValue={ticket.quantity}
              className={field}
              required
            />
          </div>

          <div>
            <label className={label}>Currency</label>
            <select name="currency" defaultValue={ticket.currency} className={field}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className={label}>Delivery Method</label>
            <select name="deliveryMethod" defaultValue={ticket.deliveryMethod} className={field}>
              {deliveryMethods.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Personalization Status</label>
            <select
              name="personalizationStatus"
              defaultValue={ticket.personalizationStatus}
              className={field}
            >
              {personalizationStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="isVisible"
                type="checkbox"
                defaultChecked={ticket.isVisible}
                className="w-4 h-4 accent-[#c9a84c]"
              />
              <span className="text-zinc-400 text-sm">Visible on site</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                name="isFeatured"
                type="checkbox"
                defaultChecked={ticket.isFeatured}
                className="w-4 h-4 accent-[#c9a84c]"
              />
              <span className="text-zinc-400 text-sm">Featured ticket</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#c9a84c] text-black font-semibold rounded-lg text-sm hover:bg-[#e8c05a] transition-colors"
          >
            Save Changes
          </button>
          <a
            href="/admin/tickets"
            className="px-6 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] text-zinc-400 rounded-lg text-sm hover:text-white transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
