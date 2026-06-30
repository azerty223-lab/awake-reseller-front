"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/frontend/components/ui/Button";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

function SignInForm() {
  const router      = useRouter();
  const params      = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/tickets";

  const [showPassword, setShowPassword] = useState(false);
  const [serverError,  setServerError]  = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    const result = await signIn("credentials", {
      email:    data.email.toLowerCase().trim(),
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      setServerError("Incorrect email or password.");
    } else {
      router.replace(callbackUrl);
      router.refresh();
    }
  };

  const handleGoogle = () => {
    setGoogleLoading(true);
    // Replace instead of push so the signin page + OAuth screens don't
    // pile up in history — back button returns to the page before login.
    const url = new URL("/api/auth/signin/google", window.location.origin);
    url.searchParams.set("callbackUrl", callbackUrl);
    window.location.replace(url.toString());
  };

  return (
    <div className="w-full">
      {/* Branding */}
      <div className="mb-8">
        <h1 className="text-white font-bold text-2xl mb-1">Welcome back</h1>
        <p className="text-zinc-500 text-sm">Sign in to continue to AW Tickets</p>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || isSubmitting}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-zinc-100 text-[#1a1a1a] font-semibold text-sm rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-black/20 mb-5"
      >
        {googleLoading
          ? <span className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
          : <FcGoogle className="w-5 h-5 shrink-0" />
        }
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-white/[0.07]" />
        <span className="text-zinc-600 text-xs">or sign in with email</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Email / password */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
          {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>}
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
              tabIndex={-1}
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="text-[#06B6D4] hover:underline font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}
