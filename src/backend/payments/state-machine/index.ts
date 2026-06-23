import { prisma } from "@/backend/lib/prisma";
import type { CryptoInvoice } from "@prisma/client";
import type { NormalizedPaymentStatus, PaymentStateEvent, StateTransitionResult } from "../types";
import { VALID_TRANSITIONS, TERMINAL_STATES } from "./transitions";
import { InvalidTransitionError } from "../errors";
import { AuditLogger } from "../audit/logger";

export class StateMachine {
  canTransition(from: NormalizedPaymentStatus, event: PaymentStateEvent): boolean {
    const transitions = VALID_TRANSITIONS[from];
    return event in transitions;
  }

  isTerminal(status: NormalizedPaymentStatus): boolean {
    return TERMINAL_STATES.includes(status);
  }

  async transition(
    invoice: CryptoInvoice,
    event: PaymentStateEvent,
    context?: {
      confirmations?: number;
      txHash?: string;
      receivedAmount?: string;
    }
  ): Promise<StateTransitionResult> {
    const fromStatus = invoice.status as NormalizedPaymentStatus;
    const toStatusFromMap = VALID_TRANSITIONS[fromStatus][event];

    if (!toStatusFromMap) {
      throw new InvalidTransitionError(fromStatus, event);
    }

    const toStatus = toStatusFromMap as NormalizedPaymentStatus;
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // Build update data
      const updateData: Record<string, unknown> = {
        status: toStatus,
        updatedAt: now,
      };

      if (toStatus === "PAYMENT_DETECTED" && !invoice.paymentDetectedAt) {
        updateData.paymentDetectedAt = now;
      }

      if (toStatus === "PAID" && !invoice.confirmedAt) {
        updateData.confirmedAt = now;
      }

      if (context?.confirmations !== undefined) {
        updateData.confirmations = context.confirmations;
      }

      if (context?.txHash) {
        updateData.txHash = context.txHash;
      }

      if (context?.receivedAmount) {
        updateData.receivedAmount = context.receivedAmount;
      }

      await tx.cryptoInvoice.update({
        where: { id: invoice.id },
        data: updateData,
      });

      // If paid, update the order as well
      if (toStatus === "PAID") {
        await tx.order.update({
          where: { id: invoice.orderId },
          data: { status: "PAID" },
        });
      }

      // Write audit log
      await tx.cryptoPaymentLog.create({
        data: {
          cryptoInvoiceId: invoice.id,
          event: "STATUS_TRANSITION",
          fromStatus: fromStatus,
          toStatus: toStatus,
          confirmations: context?.confirmations,
          txHash: context?.txHash,
          metadata: { event, context: context ?? {} },
        },
      });
    });

    return {
      previousStatus: fromStatus,
      newStatus: toStatus,
      transitionedAt: now,
    };
  }
}

export const stateMachine = new StateMachine();
