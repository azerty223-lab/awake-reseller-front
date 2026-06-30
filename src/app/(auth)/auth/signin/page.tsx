"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Ticket } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const registered = searchParams.get("registered") === "1";
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/25 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-7 h-7 text-[#06B6D4]" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-1">Sign in to AW Tickets</h1>
        <p className="text-zinc-500 text-sm">Use your Google account to continue</p>
      </div>

      {registered && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-6">
          <p className="text-emerald-400 text-sm text-center">Account created! Sign in to continue.</p>
        </div>
      )}

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white hover:bg-zinc-100 text-[#1a1a1a] font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
        ) : (
          <FcGoogle className="w-5 h-5 shrink-0" />
        )}
        Continue with Google
      </button>

      <p className="text-center text-zinc-600 text-xs mt-6 leading-relaxed">
        By signing in you agree to our{" "}
        <a href="/privacy" className="text-zinc-400 hover:text-white underline">
          Privacy Policy
        </a>
        . A new account is created automatically on first sign-in.
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
