"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Ticket, ShoppingBag, MessageSquare,
  Menu, X, LogOut, Ticket as TicketIcon
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/backend/lib/utils";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/tickets", label: "Tickets", icon: Ticket },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

interface SidebarContentProps {
  isActive: (href: string, exact?: boolean) => boolean;
  onNavigate: () => void;
}

function SidebarContent({ isActive, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-[#1a1a1a]">
        <div className="w-7 h-7 rounded-lg bg-[#c9a84c] flex items-center justify-center">
          <TicketIcon className="w-3.5 h-3.5 text-black" />
        </div>
        <div>
          <p className="text-[#c9a84c] font-bold text-sm tracking-widest">AWTICKETS</p>
          <p className="text-zinc-600 text-[10px] tracking-wider">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }: { href: string; label: string; icon: LucideIcon; exact?: boolean }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive(href, exact)
                ? "bg-[#c9a84c]/15 text-[#c9a84c] border border-[#c9a84c]/25"
                : "text-zinc-500 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1a1a1a]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] z-30">
        <SidebarContent isActive={isActive} onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-[#1a1a1a] z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#c9a84c] flex items-center justify-center">
            <TicketIcon className="w-3 h-3 text-black" />
          </div>
          <span className="text-[#c9a84c] font-bold text-sm tracking-widest">AWTICKETS</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#0a0a0a] border-r border-[#1a1a1a]">
            <SidebarContent isActive={isActive} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
