"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CartItem {
  ticketId: string;
  name: string;
  quantity: number;
  resalePrice: number;
  currency: string;
}

interface WalletOption {
  currency: string;
  network: string;
  label: string;
  networkLabel: string;
}

interface Quote {
  address: string;
  qrSvg: string;
  cryptoAmount: string;
  currency: string;
  network: string;
  networkLabel: string;
  rateEur: number;
}

interface Props {
  fiatAmount: number;
  cartItems: CartItem[];
  customerName: string;
  customerEmail: string;
}

const NETWORK_COLORS: Record<string, string> = {
  BITCOIN:  "#F7931A",
  ETHEREUM: "#627EEA",
  SOLANA:   "#9945FF",
  TRON:     "#EF0027",
  BSC:      "#F0B90B",
  POLYGON:  "#8247E5",
};

const CURRENCY_ICONS: Record<string, string> = {
  BTC:  "₿",
  ETH:  "Ξ",
  SOL:  "◎",
  USDT: "₮",
};

export function StaticCryptoCheckout({ fiatAmount, cartItems, customerName, customerEmail }: Props) {
  const [wallets, setWallets]         = useState<WalletOption[]>([]);
  const [selected, setSelected]       = useState<WalletOption | null>(null);
  const [quote, setQuote]             = useState<Quote | null>(null);
  const [orderId, setOrderId]         = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [error, setError]             = useState("");
  const [copied, setCopied]           = useState(false);

  // Inline name/email form (when arriving directly without going through checkout)
  const [name, setName]   = useState(customerName);
  const [email, setEmail] = useState(customerEmail);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/payments/static-quote");
        const data = await res.json() as { wallets: WalletOption[] };
        setWallets(data.wallets);
        if (data.wallets.length > 0) {
          setSelected(data.wallets[0]);
          void fetchQuote(data.wallets[0]);
        }
      } catch {
        setError("Failed to load payment options");
      } finally {
        setWalletsLoading(false);
      }
    })();
  }, []);

  const fetchQuote = useCallback(async (wallet: WalletOption) => {
    setLoading(true);
    setError("");
    setQuote(null);

    try {
      // 1. Fetch QR + exchange rate — always first, never blocked by order creation
      const res = await fetch("/api/payments/static-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: wallet.currency, network: wallet.network, fiatAmount }),
      });
      const data = await res.json() as Quote & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to get quote");
      setQuote(data);

      // 2. Create PENDING order in the background (non-blocking — QR already shown)
      if (name.trim() && email.trim() && cartItems.length > 0) {
        fetch("/api/checkout/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems.map((i) => ({
              ticketId: i.ticketId,
              quantity: i.quantity,
              unitPrice: i.resalePrice,
            })),
            totalAmount: fiatAmount,
            currency: "EUR",
            guestName: name.trim(),
            guestEmail: email.trim(),
          }),
        })
          .then((r) => r.json())
          .then((d: { orderId?: string; orderNumber?: string }) => {
            if (d.orderId)     setOrderId(d.orderId);
            if (d.orderNumber) setOrderNumber(d.orderNumber);
          })
          .catch(() => { /* order tracking failed silently — QR still works */ });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get quote");
    } finally {
      setLoading(false);
    }
  }, [name, email, cartItems, fiatAmount]);

  const handleSelect = (wallet: WalletOption) => {
    setSelected(wallet);
    setQuote(null);
    setOrderId(null);
    setOrderNumber(null);
    setError("");
    void fetchQuote(wallet);
  };

  const handleCopy = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(quote.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  if (walletsLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 text-center space-y-3">
        <p className="text-zinc-400 text-sm">No crypto wallets configured yet.</p>
        <p className="text-zinc-600 text-xs">Add your wallet addresses to <code className="text-[#c9a84c]">.env</code>:</p>
        <pre className="text-left text-xs text-zinc-500 bg-[#0a0a0a] rounded-lg p-3 overflow-x-auto">{[
          "STATIC_WALLET_BTC=bc1q...",
          "STATIC_WALLET_ETH=0x...",
          "STATIC_WALLET_SOL=...",
          "STATIC_WALLET_USDT_ETH=0x...",
          "STATIC_WALLET_USDT_TRX=T...",
        ].join("\n")}</pre>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Name / email collection (shown when not passed via URL) */}
      {(!customerName || !customerEmail) && (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
          <p className="text-zinc-400 text-xs uppercase tracking-widest">Your details</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name *"
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address *"
            className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60"
          />
        </div>
      )}

      {/* Currency selector */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4 space-y-3">
        <p className="text-zinc-400 text-xs uppercase tracking-widest">Select currency</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {wallets.map((w) => {
            const key = `${w.currency}_${w.network}`;
            const isSelected = selected?.currency === w.currency && selected?.network === w.network;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(w)}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all",
                  isSelected ? "border-[#c9a84c] bg-[#c9a84c]/10" : "border-[#2a2a2a] hover:border-[#3a3a3a]"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CURRENCY_ICONS[w.currency] ?? "?"}</span>
                  <span className="text-white text-sm font-semibold">{w.label}</span>
                </div>
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                  style={{ color: NETWORK_COLORS[w.network] ?? "#888", background: `${NETWORK_COLORS[w.network] ?? "#888"}20` }}
                >
                  {w.networkLabel}
                </span>
              </button>
            );
          })}
        </div>

        {selected && loading && (
          <div className="flex justify-center py-2">
            <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* QR + address */}
      {quote && (
        <div className="space-y-4">
          {/* Order number */}
          {orderNumber && (
            <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-xl p-3 flex items-center justify-between">
              <span className="text-zinc-400 text-xs">Your order reference</span>
              <span className="text-[#c9a84c] font-mono font-bold text-sm">
                #{orderNumber.slice(-8).toUpperCase()}
              </span>
            </div>
          )}

          {/* Amount */}
          <div className="text-center">
            <p className="text-zinc-500 text-sm mb-1">Send exactly</p>
            <p className="text-[#c9a84c] text-3xl font-bold tracking-tight">
              {quote.cryptoAmount} {quote.currency}
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              on {quote.networkLabel} · ≈ €{fiatAmount.toFixed(2)}
            </p>
          </div>

          {/* QR */}
          <div className="flex justify-center">
            <div className="bg-white border border-[#2a2a2a] rounded-2xl p-3 w-[288px] h-[288px] flex items-center justify-center overflow-hidden">
              <div
                className="w-full h-full [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{ __html: quote.qrSvg }}
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Wallet address</span>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ color: NETWORK_COLORS[quote.network] ?? "#888", background: `${NETWORK_COLORS[quote.network] ?? "#888"}25` }}
              >
                {quote.networkLabel}
              </span>
            </div>
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-3 flex items-center gap-3">
              <code className="flex-1 text-white text-xs font-mono break-all leading-relaxed">
                {quote.address}
              </code>
              <button
                type="button"
                onClick={() => void handleCopy()}
                className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  copied
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/30 hover:bg-[#c9a84c]/20"
                )}
              >
                {copied ? (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>Copied</>
                ) : (
                  <><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" /><path d="M8 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v4a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>Copy</>
                )}
              </button>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 space-y-2">
            <p className="text-red-400 text-xs font-semibold uppercase tracking-wider">⚠ Important</p>
            <ul className="space-y-1.5 text-xs text-red-300">
              <li>• Send <strong>only {quote.currency}</strong> on the <strong>{quote.networkLabel}</strong> network</li>
              <li>• Wrong network = <strong>permanent loss of funds</strong></li>
              <li>• Send exactly <strong>{quote.cryptoAmount} {quote.currency}</strong></li>
              <li>• After sending, email us your <strong>transaction hash</strong> with your order reference</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => { setQuote(null); setOrderId(null); setOrderNumber(null); setError(""); }}
            className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors w-full text-center"
          >
            ← Change currency
          </button>
        </div>
      )}
    </div>
  );
}
