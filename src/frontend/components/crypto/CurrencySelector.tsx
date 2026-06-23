"use client";

import { useState } from "react";
import type React from "react";
import { cn } from "@/backend/lib/utils";
import type { CryptoCurrency, CryptoNetwork } from "@prisma/client";

interface CurrencyOption {
  currency: CryptoCurrency;
  network: CryptoNetwork;
  name: string;
  networkLabel: string;
  description: string;
  recommended?: boolean;
  color: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    currency: "USDC",
    network: "ETHEREUM",
    name: "USDC",
    networkLabel: "Ethereum",
    description: "USD Coin — Stable, 1:1 USD backed",
    recommended: true,
    color: "#2775CA",
  },
  {
    currency: "USDT",
    network: "ETHEREUM",
    name: "USDT",
    networkLabel: "Ethereum",
    description: "Tether USD — Most liquid stablecoin",
    color: "#26A17B",
  },
  {
    currency: "ETH",
    network: "ETHEREUM",
    name: "ETH",
    networkLabel: "Ethereum",
    description: "Ether — Native Ethereum currency",
    color: "#627EEA",
  },
  {
    currency: "BTC",
    network: "BITCOIN",
    name: "BTC",
    networkLabel: "Bitcoin",
    description: "Bitcoin — Original cryptocurrency",
    color: "#F7931A",
  },
];

// Inline SVG icons
function USDCIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2775CA" />
      <path
        d="M20.022 18.124c0-2.124-1.28-2.852-3.84-3.156-1.828-.234-2.194-.703-2.194-1.518 0-.816.61-1.358 1.83-1.358 1.1 0 1.71.376 2.01 1.27.066.197.25.33.46.33h1.048c.27 0 .47-.247.406-.51-.418-1.76-1.69-2.592-3.924-2.592-2.194 0-3.7 1.31-3.7 3.158 0 2.03 1.248 2.79 3.808 3.093 1.75.21 2.226.636 2.226 1.554 0 .917-.782 1.534-2.03 1.534-1.596 0-2.14-.636-2.333-1.534a.47.47 0 00-.462-.375h-1.09a.42.42 0 00-.41.49c.352 2.038 1.742 3.138 4.295 3.138 2.52 0 4.1-1.31 4.1-3.524z"
        fill="white"
      />
      <path
        d="M16 5.333A10.667 10.667 0 1016 26.667 10.667 10.667 0 0016 5.333zm0 19.2a8.533 8.533 0 110-17.066 8.533 8.533 0 010 17.066z"
        fill="white"
        fillOpacity="0.3"
      />
    </svg>
  );
}

function USDTIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#26A17B" />
      <path
        d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.666 0-.82 2.902-1.497 6.79-1.668v2.654c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.654c3.88.17 6.775.848 6.775 1.667 0 .819-2.895 1.496-6.775 1.666zm0-3.61v-2.37h5.414V8H8.664v3.403h5.414v2.369c-4.4.195-7.708 1.043-7.708 2.063 0 1.02 3.308 1.867 7.708 2.062v7.379h3.844v-7.38c4.393-.195 7.695-1.042 7.695-2.061 0-1.02-3.302-1.867-7.695-2.062z"
        fill="white"
      />
    </svg>
  );
}

function ETHIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#627EEA" />
      <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="white" fillOpacity="0.6" />
      <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="white" />
      <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="white" fillOpacity="0.6" />
      <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379z" fill="white" />
      <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="white" fillOpacity="0.2" />
      <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="white" fillOpacity="0.6" />
    </svg>
  );
}

function BTCIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M22.504 14.404c.31-2.093-1.282-3.217-3.46-3.967l.707-2.836-1.726-.43-.688 2.76c-.455-.113-.923-.22-1.388-.326l.693-2.778-1.726-.43-.707 2.835c-.376-.086-.745-.17-1.105-.26l.002-.009-2.382-.594-.459 1.844s1.282.294 1.255.312c.699.175.826.638.805 1.006L12 14.36c.048.012.11.03.178.057l-.18-.045-1.104 4.424c-.083.208-.295.52-.77.4.017.024-1.256-.313-1.256-.313l-.858 1.975 2.248.56c.418.105.828.215 1.232.318l-.714 2.867 1.724.43.707-2.838c.472.128.93.246 1.378.358l-.705 2.824 1.726.43.714-2.86c2.944.557 5.159.332 6.088-2.332.75-2.14-.038-3.374-1.585-4.177 1.128-.26 1.977-1.002 2.203-2.534zm-3.943 5.528c-.534 2.14-4.143.983-5.313.693l.948-3.8c1.17.292 4.926.87 4.365 3.107zm.534-5.557c-.486 1.948-3.49.958-4.466.716l.86-3.45c.976.243 4.122.695 3.606 2.734z"
        fill="white"
      />
    </svg>
  );
}

const ICONS: Record<CryptoCurrency, (props: { size?: number }) => React.JSX.Element> = {
  USDC: USDCIcon,
  USDT: USDTIcon,
  ETH: ETHIcon,
  BTC: BTCIcon,
};

interface CurrencySelectorProps {
  onChange: (currency: CryptoCurrency, network: CryptoNetwork) => void;
  disabled?: boolean;
}

export function CurrencySelector({ onChange, disabled }: CurrencySelectorProps) {
  const [selected, setSelected] = useState<string>("USDC_ETHEREUM");

  const handleSelect = (option: CurrencyOption) => {
    if (disabled) return;
    const key = `${option.currency}_${option.network}`;
    setSelected(key);
    onChange(option.currency, option.network);
  };

  return (
    <div className="space-y-2">
      <p className="text-zinc-400 text-sm font-medium mb-3">Select payment currency</p>
      {CURRENCY_OPTIONS.map((option) => {
        const key = `${option.currency}_${option.network}`;
        const isSelected = selected === key;
        const Icon = ICONS[option.currency];

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            onClick={() => handleSelect(option)}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "border-[#c9a84c] bg-[#c9a84c]/10"
                : "border-[#2a2a2a] bg-[#111111] hover:border-[#3a3a3a] hover:bg-[#161616]"
            )}
          >
            {/* Radio indicator */}
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all",
                isSelected
                  ? "border-[#c9a84c] bg-[#c9a84c]"
                  : "border-zinc-600"
              )}
            >
              {isSelected && (
                <div className="w-full h-full rounded-full bg-[#c9a84c] scale-50" />
              )}
            </div>

            {/* Icon */}
            <div className="flex-shrink-0">
              <Icon size={36} />
            </div>

            {/* Labels */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{option.name}</span>
                <span className="text-xs text-zinc-500 bg-[#0a0a0a] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
                  {option.networkLabel}
                </span>
                {option.recommended && (
                  <span className="text-xs text-black bg-[#c9a84c] px-2 py-0.5 rounded-full font-semibold">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-0.5">{option.description}</p>
            </div>

            {/* Selection indicator line */}
            {isSelected && (
              <div className="w-0.5 h-8 bg-[#c9a84c] rounded-full flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
