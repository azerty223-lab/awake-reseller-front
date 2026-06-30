"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react";
import { useCartStore } from "@/frontend/store/cart";
import { cn } from "@/backend/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tickets", label: "Tickets" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  onCartOpen: () => void;
}

export function Navbar({ onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "backdrop-blur-md bg-black/60 border-b border-white/[0.07] py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <img
                src="/brand/awtickets-mark.svg"
                alt=""
                aria-hidden="true"
                style={{ height: "34px", width: "auto" }}
              />
              <div className="leading-none">
                <span
                  className="block font-black text-white/90"
                  style={{ fontSize: "14px", letterSpacing: "0.18em" }}
                >
                  AW TICKETS
                </span>
                <span
                  className="block font-bold"
                  style={{ fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#00A0B6", marginTop: "3px" }}
                >
                  Verified Festival Resale
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium tracking-wide transition-colors duration-200",
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:bg-[#06B6D4] after:transition-transform after:duration-300",
                    pathname === link.href
                      ? "text-[#06B6D4] after:scale-x-100"
                      : "text-zinc-400 hover:text-white after:scale-x-0 hover:after:scale-x-100"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Auth state */}
              {status !== "loading" && (
                session ? (
                  <div className="hidden md:flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] text-zinc-300">
                      {session.user?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={session.user.image}
                          alt=""
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium max-w-[100px] truncate">
                        {session.user?.name?.split(" ")[0] ?? "Account"}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/tickets" })}
                      className="flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.07] hover:border-red-400/30 bg-white/[0.04] hover:bg-red-400/10 text-zinc-500 hover:text-red-400 transition-all duration-200"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#06B6D4]/30 bg-[#06B6D4]/[0.06] hover:bg-[#06B6D4]/[0.12] text-[#06B6D4] text-xs font-medium tracking-wide transition-all duration-200"
                  >
                    Sign in
                  </Link>
                )
              )}

              {/* Cart pill button */}
              <button
                onClick={onCartOpen}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.07] hover:border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.07] transition-all duration-300 text-zinc-300 hover:text-white group"
                aria-label={`Cart (${itemCount} items)`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium tracking-wide">
                  Cart
                </span>
                {itemCount > 0 && (
                  <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-black text-[10px] font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.07] hover:border-white/[0.14] bg-white/[0.04] hover:bg-white/[0.07] text-zinc-400 hover:text-white transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-0 pt-20 z-40 md:hidden backdrop-blur-md bg-black/80 border-b border-white/[0.07]"
          >
            <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200",
                    pathname === link.href
                      ? "bg-[#06B6D4]/10 text-[#06B6D4]"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/[0.07] my-1" />
              {session ? (
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/tickets" }); }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[#06B6D4] bg-[#06B6D4]/10 transition-all duration-200"
                >
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
