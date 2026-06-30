"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/frontend/components/ui/Button";

const schema = z.object({
  name:            z.string().min(2, "Name must be at least 2 characters").max(50),
  email:           z.string().email("Invalid email address"),
  password:        z.string()
    .min(8,  "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",       ok: password.length >= 8 },
    { label: "Uppercase letter",     ok: /[A-Z]/.test(password) },
    { label: "Number",               ok: /\d/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="flex gap-3 mt-2 flex-wrap">
      {checks.map(c => (
        <span key={c.label} className={`flex items-center gap-1 text-[11px] ${c.ok ? "text-emerald-400" : "text-zinc-600"}`}>
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          {c.label}
        </span>
      ))}
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();

  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm,  setShowConfirm]    = useState(false);
  const [serverError,  setServerError]    = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  const passwordValue = watch("password") ?? "";

  const onSubmit = async (data: FormData) => {
    setServerError("");

    const res = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:     data.name.trim(),
        email:    data.email.toLowerCase().trim(),
        password: data.password,
      }),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setServerError(json.error ?? "Registration failed. Please try again.");
      return;
    }

    // Auto sign-in after successful registration
    const result = await signIn("credentials", {
      email:    data.email.toLowerCase().trim(),
      password: data.password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/tickets");
      router.refresh();
    } else {
      // Account created but auto-login failed — send to sign-in
      router.push("/auth/signin?registered=1");
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/tickets" });
  };

  return (
    <div className="w-full">
      {/* Branding */}
      <div className="mb-8">
        <h1 className="text-white font-bold text-2xl mb-1">Create an account</h1>
        <p className="text-zinc-500 text-sm">Join AW Tickets — track and manage your orders</p>
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
        <span className="text-zinc-600 text-xs">or create with email</span>
        <div className="flex-1 h-px bg-white/[0.07]" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name */}
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
          {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>}
        </div>

        {/* Email */}
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

        {/* Password */}
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
            <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <PasswordStrength password={passwordValue} />
          {errors.password && <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>}
        </div>

        {/* Confirm password */}
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
            <button type="button" tabIndex={-1} onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1.5">{errors.confirmPassword.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-red-400 text-sm">{serverError}</p>
          </div>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-zinc-600 text-sm mt-6">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-[#06B6D4] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
}
