import type { Ticket as PrismaTicket } from "@prisma/client";

export type Ticket = PrismaTicket;

export const TicketCategory = {
  WEEKEND: "WEEKEND",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
  CAMPING: "CAMPING",
  COMFORT_CAMPING: "COMFORT_CAMPING",
  CAR_CAMPING: "CAR_CAMPING",
  PREMIUM: "PREMIUM",
  ACCOMMODATION: "ACCOMMODATION",
} as const;

export type TicketCategory = (typeof TicketCategory)[keyof typeof TicketCategory];

export const DeliveryMethod = {
  DIGITAL: "DIGITAL",
  PHYSICAL: "PHYSICAL",
  NAME_CHANGE: "NAME_CHANGE",
} as const;

export type DeliveryMethod = (typeof DeliveryMethod)[keyof typeof DeliveryMethod];

export const PersonalizationStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  NOT_REQUIRED: "NOT_REQUIRED",
} as const;

export type PersonalizationStatus =
  (typeof PersonalizationStatus)[keyof typeof PersonalizationStatus];
