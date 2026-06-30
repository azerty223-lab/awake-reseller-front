"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { User, Mail, Tag, MessageSquare, Send, CheckCircle, Clock } from "lucide-react";
import { Turnstile } from "@/frontend/components/ui/Turnstile";

const contactSchema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

const inputBase =
  "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#06B6D4]/50 focus:bg-white/[0.06] focus-visible:outline-none transition-all";
const inputClass = `${inputBase} px-4 py-3.5`;
const inputIconClass = `${inputBase} pl-10 pr-4 py-3.5`;
const textareaIconClass = `${inputBase} pl-10 pr-4 py-3.5 resize-none`;
const labelClass = "block text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-2";

function FieldIcon({ children, align = "center" }: { children: React.ReactNode; align?: "center" | "top" }) {
  return (
    <span
      className={["absolute left-3 pointer-events-none text-zinc-500", align === "center" ? "top-1/2 -translate-y-1/2" : "top-3.5"].join(" ")}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export function ContactForm() {
  const [submitted,      setSubmitted]      = useState(false);
  const [error,          setError]          = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    setError("");
    try {
      const res    = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, turnstileToken }) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Failed to send message");
      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Page hero */}
        <div className="mb-12 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-4">Get in Touch</p>
          <h1 className="font-[var(--font-playfair)] text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-zinc-500 text-sm max-w-sm mx-auto">
            Questions about tickets, transfers, or your order? We typically respond within a few hours.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-0.5">Email</p>
              <p className="text-white text-sm font-medium">awtickets@outlook.com</p>
            </div>
          </div>
          <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#06B6D4]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500 mb-0.5">Response Time</p>
              <p className="text-white text-sm font-medium">Within 4 hours (9–22 CET)</p>
            </div>
          </div>
        </div>

        {/* Form / Success */}
        {submitted ? (
          <div className="bg-white/[0.03] border border-emerald-500/20 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="font-[var(--font-playfair)] text-white font-bold text-2xl mb-2">Message Sent</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-xs mx-auto">
              We&apos;ve received your message and will reply to your email within a few hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="border border-white/20 text-white rounded-xl px-6 py-3 text-sm hover:bg-white/[0.07] hover:border-white/40 transition-all duration-300"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass} htmlFor="contact-name">Full Name *</label>
                <div className="relative">
                  <FieldIcon align="center"><User className="w-4 h-4" /></FieldIcon>
                  <input id="contact-name" {...register("name")} placeholder="Your name" autoComplete="name" className={inputIconClass} />
                </div>
                {errors.name && <p className="mt-1.5 text-red-400 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="contact-email">Email Address *</label>
                <div className="relative">
                  <FieldIcon align="center"><Mail className="w-4 h-4" /></FieldIcon>
                  <input id="contact-email" {...register("email")} type="email" placeholder="your@email.com" autoComplete="email" className={inputIconClass} />
                </div>
                {errors.email && <p className="mt-1.5 text-red-400 text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-subject">Subject *</label>
              <div className="relative">
                <FieldIcon align="center"><Tag className="w-4 h-4" /></FieldIcon>
                <input id="contact-subject" {...register("subject")} placeholder="e.g. Question about name transfer" className={inputIconClass} />
              </div>
              {errors.subject && <p className="mt-1.5 text-red-400 text-xs">{errors.subject.message}</p>}
            </div>

            <div>
              <label className={labelClass} htmlFor="contact-message">Message *</label>
              <div className="relative">
                <FieldIcon align="top"><MessageSquare className="w-4 h-4" /></FieldIcon>
                <textarea id="contact-message" {...register("message")} placeholder="Describe your question or request in detail..." rows={5} className={textareaIconClass} />
              </div>
              {errors.message && <p className="mt-1.5 text-red-400 text-xs">{errors.message.message}</p>}
            </div>

            <Turnstile onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

            {error && (
              <div className="bg-red-500/[0.06] border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#06B6D4] to-[#22D3EE] text-black font-bold rounded-xl text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >
              {isSubmitting ? (
                <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg> Sending…</>
              ) : (
                <>Send Message <Send className="w-4 h-4" /></>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
