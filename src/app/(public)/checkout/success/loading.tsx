import { Loader2 } from "lucide-react";

export default function CheckoutSuccessLoading() {
  return (
    <div className="min-h-screen bg-[#030305] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" aria-hidden="true" />
        <p className="text-sm text-zinc-500">Confirming your order…</p>
      </div>
    </div>
  );
}
