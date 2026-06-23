import { prisma } from "@/backend/lib/prisma";

export interface CheckoutInputItem {
  ticketId: string;
  quantity: number;
}

export interface ResolvedCheckoutItem {
  ticketId: string;
  quantity: number;
  unitPrice: number;
  name: string;
  currency: string;
}

export class CheckoutValidationError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export async function resolveCheckoutItems(items: CheckoutInputItem[]): Promise<{
  items: ResolvedCheckoutItem[];
  totalAmount: number;
  currency: string;
}> {
  const merged = new Map<string, number>();

  for (const item of items) {
    merged.set(item.ticketId, (merged.get(item.ticketId) ?? 0) + item.quantity);
  }

  const ids = [...merged.keys()];
  const tickets = await prisma.ticket.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      quantity: true,
      sold: true,
      isVisible: true,
      resalePrice: true,
      currency: true,
    },
  });

  const byId = new Map(tickets.map((ticket) => [ticket.id, ticket]));
  const currencies = new Set<string>();
  const resolved: ResolvedCheckoutItem[] = [];

  for (const [ticketId, quantity] of merged) {
    const ticket = byId.get(ticketId);
    if (!ticket || !ticket.isVisible) {
      throw new CheckoutValidationError(`Ticket not found: ${ticketId}`, 404);
    }

    if (ticket.quantity - ticket.sold < quantity) {
      throw new CheckoutValidationError(`Not enough availability for ${ticket.name}`, 409);
    }

    currencies.add(ticket.currency);
    resolved.push({
      ticketId,
      quantity,
      unitPrice: ticket.resalePrice,
      name: ticket.name,
      currency: ticket.currency,
    });
  }

  if (currencies.size > 1) {
    throw new CheckoutValidationError("Mixed-currency carts are not supported", 400);
  }

  return {
    items: resolved,
    totalAmount: resolved.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    currency: resolved[0]?.currency ?? "EUR",
  };
}
