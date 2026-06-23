"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Is buying resale tickets legal?",
    a: "Yes. Resale of festival tickets is permitted in the Netherlands under consumer law. We sell tickets that are legally owned by a private individual. The tickets are real, valid, and purchased from the official Awakenings box office.",
  },
  {
    q: "How does the name personalization work?",
    a: "Awakenings Festival personalizes tickets to a specific attendee. After your purchase, we initiate the official name change process through Awakenings' transfer system. You'll receive your personalized e-ticket at your email address, typically within 3–5 business days of purchase.",
  },
  {
    q: "How are tickets delivered?",
    a: "All tickets are delivered digitally to the email address you provide at checkout. After the name transfer is complete, you'll receive your personalized PDF e-ticket via email. No physical tickets are shipped.",
  },
  {
    q: "What is your refund policy?",
    a: "Due to the nature of festival tickets and the transfer process, all sales are final once the name change has been initiated. If the event is officially cancelled by the organizer, we will provide a full refund. For other circumstances, please contact us — we handle each case individually.",
  },
  {
    q: "When will I receive my ticket?",
    a: "The name transfer process typically takes 3–5 business days after payment is confirmed. You'll receive email updates at each stage. In most cases, tickets are delivered well before the festival. For urgent requests or last-minute purchases, contact us immediately.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach us via the Contact page or email us directly at awtickets@outlook.com. We aim to respond within a few hours during business hours (CET). For urgent matters close to the festival date, mention 'URGENT' in your subject line.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
              FAQ
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mb-3">
            Common Questions
          </h2>
          <p className="text-zinc-500 text-sm">
            Everything you need to know before purchasing
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span
                  className={`font-medium text-sm transition-colors ${
                    openIndex === index ? "text-[#c9a84c]" : "text-white"
                  }`}
                >
                  {faq.q}
                </span>
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index
                      ? "bg-[#c9a84c]/20 text-[#c9a84c]"
                      : "bg-[#1a1a1a] text-zinc-500"
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-[#1a1a1a]">
                      <p className="text-zinc-400 text-sm leading-relaxed pt-4">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
