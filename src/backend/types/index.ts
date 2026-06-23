import type { Ticket, Order, OrderItem, User, TicketCategory, DeliveryMethod, PersonalizationStatus, OrderStatus, InquiryStatus, Role } from "@prisma/client";

export type { TicketCategory, DeliveryMethod, PersonalizationStatus, OrderStatus, InquiryStatus, Role };

export type TicketWithDetails = Ticket & {
  orderItems?: OrderItem[];
  available: number;
};

export type OrderItemWithTicket = OrderItem & {
  ticket: Ticket;
};

export type OrderWithItems = Order & {
  orderItems: OrderItemWithTicket[];
  user?: User | null;
};

export interface CartItem {
  ticketId: string;
  name: string;
  slug: string;
  resalePrice: number;
  currency: string;
  quantity: number;
  maxQuantity: number;
  category: TicketCategory;
  dayLabel?: string | null;
  deliveryMethod: DeliveryMethod;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (ticketId: string) => void;
  updateQuantity: (ticketId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone?: string;
}

export interface InquiryFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}
