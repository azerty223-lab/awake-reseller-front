"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Ticket, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/frontend/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect away as soon as we know the session state
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return; // not logged in → stay on login page
    const role = (session.user as { role?: string }).role;
    // Admin already logged in → go straight to dashboard
    // Non-admin logged in → redirect home (don't reveal admin panel exists)
    router.replace(role === "ADMIN" ? "/admin" : "/");
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  // Blank screen while session loads or redirect is in flight
  if (status === "loading" || session?.user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#c9a84c]/30 border-t-[#c9a84c] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#c9a84c] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#c9a84c]/20">
            <Ticket className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-white font-bold text-2xl mb-1">Admin Login</h1>
          <p className="text-zinc-500 text-sm">AW Tickets — Staff Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-zinc-400 text-sm mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 text-sm mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-zinc-700 text-xs mt-6">
          AW Tickets © 2026 — Admin Portal
        </p>
      </div>
    </div>
  );
}
