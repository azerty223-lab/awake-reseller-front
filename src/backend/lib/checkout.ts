import { prisma } from "@/backend/lib/prisma";
import { getRedis } from "@/backend/payments/queues/connection";

const RESERVATION_TTL = 30 * 60; // 30 minutes — matches Stripe session expiry

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

    const available = ticket.quantity - ticket.sold;

    if (available < quantity) {
      throw new CheckoutValidationError(`Not enough availability for ${ticket.name}`, 409);
    }

    // Atomic Redis reservation prevents concurrent checkouts overselling the
    // same ticket. INCRBY is sequential in Redis, so each caller gets a unique
    // new total. If the new total exceeds availability we immediately undo.
    try {
      const redis = getRedis();
      const key = `ticket:reserve:${ticketId}`;
      const newTotal = await redis.incrby(key, quantity);
      await redis.expire(key, RESERVATION_TTL);

      if (newTotal > available) {
        await redis.decrby(key, quantity);
        throw new CheckoutValidationError(`Not enough availability for ${ticket.name}`, 409);
      }
    } catch (err) {
      if (err instanceof CheckoutValidationError) throw err;
      // Redis unavailable — fall back to the DB-only check above (fail open)
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
