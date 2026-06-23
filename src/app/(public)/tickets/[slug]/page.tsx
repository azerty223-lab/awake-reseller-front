import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { TicketDetailPage } from "@/components/tickets/TicketDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ticket = await prisma.ticket.findUnique({ where: { slug } });
  if (!ticket) return { title: "Ticket Not Found" };

  return {
    title: ticket.name,
    description: ticket.description.slice(0, 160),
  };
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { slug, isVisible: true },
  });

  if (!ticket) notFound();

  return <TicketDetailPage ticket={ticket} />;
}
