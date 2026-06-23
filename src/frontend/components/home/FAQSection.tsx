"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import Link from "next/link";

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
    <section id="faq" className="py-24 bg-[#080809]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-500">
            FAQs
          </span>
          <h2 className="mt-3 font-[var(--font-playfair)] text-4xl sm:text-5xl font-black text-white">
            Common Questions
          </h2>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.02] hover:border-white/[0.1] transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center px-6 py-5"
              >
                <span className="text-white font-medium text-left text-sm sm:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className="text-[#C9A84C] w-5 h-5 flex-shrink-0 ml-4 transition-transform duration-300"
                  style={{ transform: openIndex === index ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-zinc-500 text-sm">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 text-[#C9A84C] hover:text-[#E4BA65] transition-colors font-medium"
            >
              Get in touch
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
