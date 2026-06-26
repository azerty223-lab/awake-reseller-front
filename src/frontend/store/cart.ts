import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/backend/types";

const MAX_TICKETS_PER_ORDER = 4;

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

function computeDerived(items: CartItem[]) {
  return {
    total:     items.reduce((s, i) => s + i.resalePrice * i.quantity, 0),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existing  = items.find((i) => i.ticketId === newItem.ticketId);
        const currentOrderTotal = items.reduce((s, i) => s + i.quantity, 0);
        const currentForThisItem = existing?.quantity ?? 0;
        const requestedQty = newItem.quantity ?? 1;

        // Capacity = min(per-ticket stock remaining, per-order seats still free)
        const stockCapacity = newItem.maxQuantity - currentForThisItem;
        const orderCapacity = MAX_TICKETS_PER_ORDER - currentOrderTotal;
        const availableCapacity = Math.min(stockCapacity, orderCapacity);

        if (availableCapacity <= 0) return;

        const addQty = Math.min(requestedQty, availableCapacity);
        let updated: CartItem[];

        if (existing) {
          updated = items.map((i) =>
            i.ticketId === newItem.ticketId
              ? { ...i, quantity: i.quantity + addQty }
              : i
          );
        } else {
          updated = [...items, { ...newItem, quantity: addQty }];
        }

        set({ items: updated, ...computeDerived(updated) });
      },

      removeItem: (ticketId) => {
        const updated = get().items.filter((i) => i.ticketId !== ticketId);
        set({ items: updated, ...computeDerived(updated) });
      },

      updateQuantity: (ticketId, quantity) => {
        const items = get().items;
        if (quantity <= 0) {
          const updated = items.filter((i) => i.ticketId !== ticketId);
          set({ items: updated, ...computeDerived(updated) });
          return;
        }

        const otherTotal = items
          .filter((i) => i.ticketId !== ticketId)
          .reduce((s, i) => s + i.quantity, 0);

        const updated = items.map((i) =>
          i.ticketId === ticketId
            ? {
                ...i,
                quantity: Math.min(
                  quantity,
                  i.maxQuantity,                           // per-ticket stock cap
                  MAX_TICKETS_PER_ORDER - otherTotal        // per-order cap
                ),
              }
            : i
        );
        set({ items: updated, ...computeDerived(updated) });
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "awakenings-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const derived = computeDerived(state.items);
          state.total     = derived.total;
          state.itemCount = derived.itemCount;
        }
      },
    }
  )
);
