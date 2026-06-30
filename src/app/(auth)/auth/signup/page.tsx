"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, Ticket } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/frontend/components/ui/Button";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password too long"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState("");
  const [oauthLoading, setOauthLoading] = useState<"google" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Registration failed. Please try again.");
      return;
    }

    router.push("/auth/signin?registered=1");
  };

  const handleOAuth = async (provider: "google") => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/25 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-7 h-7 text-[#06B6D4]" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-1">Create an account</h1>
        <p className="text-zinc-500 text-sm">Join AW Tickets — track your orders</p>
      </div>

      {/* OAuth buttons */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-zinc-100 text-[#1a1a1a] font-medium text-sm rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {oauthLoading === "google" ? (
            <span className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          ) : (
            <FcGoogle className="w-5 h-5 shrink-0" />
          )}
          Continue with Google
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-zinc-600 text-xs">or register with email</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-zinc-400 text-sm mb-1.5">Full name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              {...register("name")}
              type="text"
              placeholder="Your name"
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#06B6D4]/50 transition-colors"
            />
          </div>
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-1.5">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#06B6D4]/50 transition-colors"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#06B6D4]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-zinc-400 text-sm mb-1.5">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className="w-full pl-10 pr-10 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#06B6D4]/50 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-[#06B6D4] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
