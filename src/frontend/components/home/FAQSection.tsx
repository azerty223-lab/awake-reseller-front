"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LineReveal } from "@/frontend/components/ui/LineReveal";

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

const INTER = "var(--font-inter, Inter, system-ui, sans-serif)";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative pt-5 pb-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="max-w-3xl mx-auto px-6 sm:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mb-5"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "0.75rem" }}>
            <span style={{ width: "16px", height: "1px", background: "rgba(184,146,58,0.45)", flexShrink: 0 }} />
            <span style={{
              fontFamily:    INTER,
              fontSize:      "11px",
              fontWeight:    400,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color:         "rgba(237,233,225,0.50)",
            }}>
              FAQs
            </span>
          </div>
          <h2
            className="font-[var(--font-playfair)] font-black text-white"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            <LineReveal>Common</LineReveal>
            <LineReveal delay={0.09}>questions</LineReveal>
          </h2>
        </motion.div>

        {/* Editorial accordion — no cards, just horizontal rules */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-t border-white/[0.06] last-of-type:border-b">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="group w-full flex items-start gap-6 sm:gap-8 py-7 text-left
                             transition-colors duration-300"
                >
                  {/* Index */}
                  <span
                    style={{
                      fontFamily:    INTER,
                      fontSize:      "11px",
                      fontWeight:    400,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color:         isOpen
                        ? "rgba(184,146,58,0.75)"
                        : "rgba(237,233,225,0.40)",
                      transition:    "color 0.4s ease",
                      flexShrink:    0,
                      paddingTop:    "4px",
                      minWidth:      "2.5rem",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Question */}
                  <span
                    style={{
                      fontFamily:  INTER,
                      fontSize:    "clamp(0.9375rem, 2vw, 1.125rem)",
                      fontWeight:  400,
                      lineHeight:  1.5,
                      color:       isOpen
                        ? "rgba(237,233,225,0.95)"
                        : "rgba(237,233,225,0.70)",
                      transition:  "color 0.4s ease",
                      flex:        1,
                    }}
                  >
                    {faq.q}
                  </span>

                  {/* Plus / minus indicator */}
                  <span
                    style={{
                      flexShrink:  0,
                      fontFamily:  INTER,
                      fontSize:    "1rem",
                      fontWeight:  200,
                      color:       isOpen
                        ? "rgba(184,146,58,0.80)"
                        : "rgba(237,233,225,0.45)",
                      transition:  "color 0.4s ease, transform 0.4s ease",
                      transform:   isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      display:     "block",
                      lineHeight:  1,
                      paddingTop:  "3px",
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontFamily:   INTER,
                          fontSize:     "0.9375rem",
                          lineHeight:   1.85,
                          color:        "rgba(161,161,170,0.75)",
                          paddingLeft:  "calc(2.5rem + 1.5rem)",
                          paddingRight: "2rem",
                          paddingBottom: "1.75rem",
                        }}
                      >
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ marginTop: "3rem" }}
        >
          <p style={{
            fontFamily: INTER,
            fontSize:   "0.875rem",
            color:      "rgba(113,113,122,0.7)",
          }}>
            Still have questions?{" "}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5"
              style={{
                color:      "#B8923A",
                fontWeight: 400,
                transition: "color 0.3s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#B8923A")}
            >
              Get in touch
              <ArrowRight
                className="group-hover:translate-x-0.5 transition-transform duration-300"
                style={{ width: "13px", height: "13px" }}
              />
            </Link>
          </p>
        </motion.div>

      </div>
    </section>
  );
}

