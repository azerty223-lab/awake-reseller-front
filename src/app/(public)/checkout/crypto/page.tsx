"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { StaticCryptoCheckout } from "@/components/crypto/StaticCryptoCheckout";
import { ArrowLeft, ShoppingCart, Bitcoin } from "lucide-react";

function CryptoCheckoutInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, total } = useCartStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const customerName  = searchParams.get("name")  ?? "";
  const customerEmail = searchParams.get("email") ?? "";

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#161616] border border-[#2a2a2a] flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-8 h-8 text-zinc-600" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-zinc-500 mb-6">Add some tickets to proceed to checkout</p>
          <Button variant="primary" onClick={() => router.push("/tickets")}>Browse Tickets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 flex items-center justify-center mx-auto mb-4">
            <Bitcoin className="w-6 h-6 text-[#c9a84c]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Crypto Payment</h1>
          <p className="text-zinc-500 text-sm">Awakenings Festival 2026 · Secure Checkout</p>
        </div>

        {/* Order summary */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 mb-5">
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Order Summary</h2>
          <div className="space-y-2.5 mb-4">
            {items.map((item) => (
              <div key={item.ticketId} className="flex justify-between text-sm">
                <span className="text-zinc-400">{item.name} × {item.quantity}</span>
                <span className="text-white">{formatPrice(item.resalePrice * item.quantity, item.currency)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-[#c9a84c] text-xl font-bold">{formatPrice(total)}</span>
          </div>
          {customerName && (
            <div className="mt-3 pt-3 border-t border-[#2a2a2a] space-y-1 text-xs text-zinc-500">
              <div className="flex justify-between"><span>Name</span><span className="text-zinc-300">{customerName}</span></div>
              <div className="flex justify-between"><span>Email</span><span className="text-zinc-300">{customerEmail}</span></div>
            </div>
          )}
        </div>

        {/* Static wallet checkout */}
        <StaticCryptoCheckout
          fiatAmount={total}
          cartItems={items}
          customerName={customerName}
          customerEmail={customerEmail}
        />

        {/* Back */}
        <div className="mt-5">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to checkout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CryptoCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CryptoCheckoutInner />
    </Suspense>
  );
}
