"use client";

import { useState } from "react";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { CartDrawer } from "@/frontend/components/layout/CartDrawer";
import { VisitorTracker } from "@/frontend/components/analytics/VisitorTracker";
import { AnimatedBackground } from "@/frontend/components/layout/AnimatedBackground";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#020203" }}>
      <AnimatedBackground />
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <main className="flex-1 pt-16 sm:pt-20">{children}</main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <VisitorTracker />
    </div>
  );
}
