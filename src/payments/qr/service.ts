import QRCode from "qrcode";
import type { CryptoCurrency, CryptoNetwork } from "@prisma/client";
import type { CryptoInvoice } from "@prisma/client";
import type { QrPayload } from "../types";
import Decimal from "decimal.js";

// EIP-681 requires the token contract address, not the recipient, in the scheme
const ERC20_CONTRACTS: Partial<Record<string, string>> = {
  USDC_ETHEREUM: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDC_BASE:     "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  USDC_POLYGON:  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  USDT_ETHEREUM: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
};

export class QrCodeService {
  buildPaymentUri(
    address: string,
    amount: string,
    currency: CryptoCurrency,
    network: CryptoNetwork
  ): string {
    if (currency === "BTC" && network === "BITCOIN") {
      // BIP21
      return `bitcoin:${address}?amount=${amount}`;
    }

    if (currency === "ETH" && network === "ETHEREUM") {
      // EIP-681 native ETH — value in wei
      const weiAmount = new Decimal(amount).mul("1e18").toFixed(0);
      return `ethereum:${address}?value=${weiAmount}`;
    }

    // ERC-20 tokens: proper EIP-681 transfer call
    // Format: ethereum:<contractAddress>/transfer?address=<recipient>&uint256=<amountInBaseUnits>
    const contractAddress = ERC20_CONTRACTS[`${currency}_${network}`];
    if (contractAddress) {
      // USDC and USDT both have 6 decimals
      const baseUnits = new Decimal(amount).mul("1e6").toFixed(0);
      return `ethereum:${contractAddress}/transfer?address=${address}&uint256=${baseUnits}`;
    }

    // Generic fallback
    return `${currency.toLowerCase()}:${address}?amount=${amount}`;
  }

  async generateQr(uri: string): Promise<string> {
    const svg = await QRCode.toString(uri, {
      type: "svg",
      width: 280,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    return svg;
  }

  async generatePayload(invoice: CryptoInvoice): Promise<QrPayload> {
    const uri = this.buildPaymentUri(
      invoice.paymentAddress,
      invoice.cryptoAmount,
      invoice.cryptoCurrency,
      invoice.cryptoNetwork
    );
    const svgString = await this.generateQr(uri);
    return {
      uri,
      svgString,
      address: invoice.paymentAddress,
      amount: invoice.cryptoAmount,
      currency: invoice.cryptoCurrency,
      network: invoice.cryptoNetwork,
    };
  }
}

export const qrCodeService = new QrCodeService();
