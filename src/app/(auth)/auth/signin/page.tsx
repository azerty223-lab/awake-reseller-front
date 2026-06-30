"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, Ticket } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/frontend/components/ui/Button";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [oauthLoading, setOauthLoading] = useState<"google" | "facebook" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleOAuth = async (provider: "google" | "facebook") => {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/10 border border-[#06B6D4]/25 flex items-center justify-center mx-auto mb-4">
          <Ticket className="w-7 h-7 text-[#06B6D4]" />
        </div>
        <h1 className="text-white font-bold text-2xl mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm">Sign in to your AW Tickets account</p>
      </div>

      {registered && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
          <p className="text-emerald-400 text-sm text-center">
            Account created! Sign in to continue.
          </p>
        </div>
      )}

      {/* OAuth buttons */}
      <div className="space-y-3 mb-6">
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

        <button
          type="button"
          onClick={() => handleOAuth("facebook")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium text-sm rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {oauthLoading === "facebook" ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FaFacebook className="w-5 h-5 shrink-0" />
          )}
          Continue with Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-zinc-600 text-xs">or sign in with email</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="••••••••"
              autoComplete="current-password"
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
          Sign In
        </Button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-[#06B6D4] hover:underline">
          Create one
        </Link>
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
