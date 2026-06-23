import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.ticketId === newItem.ticketId);
        let updated: CartItem[];

        if (existing) {
          updated = items.map((i) =>
            i.ticketId === newItem.ticketId
              ? { ...i, quantity: Math.min(i.quantity + (newItem.quantity ?? 1), newItem.maxQuantity) }
              : i
          );
        } else {
          updated = [...items, { ...newItem, quantity: newItem.quantity ?? 1 }];
        }

        set({
          items: updated,
          total: updated.reduce((s, i) => s + i.resalePrice * i.quantity, 0),
          itemCount: updated.reduce((s, i) => s + i.quantity, 0),
        });
      },

      removeItem: (ticketId) => {
        const updated = get().items.filter((i) => i.ticketId !== ticketId);
        set({
          items: updated,
          total: updated.reduce((s, i) => s + i.resalePrice * i.quantity, 0),
          itemCount: updated.reduce((s, i) => s + i.quantity, 0),
        });
      },

      updateQuantity: (ticketId, quantity) => {
        const items = get().items;
        const updated =
          quantity <= 0
            ? items.filter((i) => i.ticketId !== ticketId)
            : items.map((i) =>
                i.ticketId === ticketId
                  ? { ...i, quantity: Math.min(quantity, i.maxQuantity) }
                  : i
              );
        set({
          items: updated,
          total: updated.reduce((s, i) => s + i.resalePrice * i.quantity, 0),
          itemCount: updated.reduce((s, i) => s + i.quantity, 0),
        });
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),
    }),
    {
      name: "awakenings-cart",
      partialize: (state) => ({ items: state.items }),
      // Recompute derived values on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          const items = state.items;
          state.total = items.reduce((s, i) => s + i.resalePrice * i.quantity, 0);
          state.itemCount = items.reduce((s, i) => s + i.quantity, 0);
        }
      },
    }
  )
);
