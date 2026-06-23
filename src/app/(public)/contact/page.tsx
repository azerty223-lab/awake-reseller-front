"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Mail, MessageSquare, Send, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/ui/Turnstile";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setError("");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error ?? "Failed to send message");
      }

      setSubmitted(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">Get in touch</span>
          </div>
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-white mb-3">
            Contact Us
          </h1>
          <p className="text-zinc-500 text-sm">
            Questions about tickets, transfers, or your order? We typically respond within a few hours.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Email</p>
              <p className="text-white text-sm font-medium">awtickets@outlook.com</p>
            </div>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div>
              <p className="text-zinc-500 text-xs">Response time</p>
              <p className="text-white text-sm font-medium">Within 4 hours (9–22 CET)</p>
            </div>
          </div>
        </div>

        {/* Form */}
        {submitted ? (
          <div className="bg-[#111111] border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-white font-bold text-xl mb-2">Message Sent!</h2>
            <p className="text-zinc-400 text-sm mb-6">
              We've received your message and will reply to your email within a few hours.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Full Name *</label>
                <input
                  {...register("name")}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                {errors.name && <p className="mt-1 text-red-400 text-xs">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-zinc-400 text-sm mb-1.5">Email Address *</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
                />
                {errors.email && <p className="mt-1 text-red-400 text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-1.5">Subject *</label>
              <input
                {...register("subject")}
                placeholder="e.g. Question about name transfer"
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors"
              />
              {errors.subject && <p className="mt-1 text-red-400 text-xs">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-zinc-400 text-sm mb-1.5">Message *</label>
              <textarea
                {...register("message")}
                placeholder="Describe your question or request in detail..."
                rows={5}
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-[#c9a84c]/60 transition-colors resize-none"
              />
              {errors.message && <p className="mt-1 text-red-400 text-xs">{errors.message.message}</p>}
            </div>

            <Turnstile onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<Send className="w-4 h-4" />}
            >
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
