"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";

/* ── Types ─────────────────────────────────────────────────────── */
interface Message {
  role: "user" | "assistant";
  content: string;
}

/* ── Design tokens ──────────────────────────────────────────────── */
const I    = "var(--font-inter, Inter, system-ui, sans-serif)";
const CYAN = "#06B6D4";

/* ── Suggested questions ─────────────────────────────────────────── */
const SUGGESTIONS = [
  "How does ticket delivery work?",
  "When will I get my e-ticket?",
  "What's the refund policy?",
  "Which camping option is best?",
];

/* ── Component ──────────────────────────────────────────────────── */
export function ChatWidget({ cartOpen = false }: { cartOpen?: boolean }) {
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLTextAreaElement>(null);
  const abortRef    = useRef<AbortController | null>(null);

  /* Auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  /* Clean up on unmount */
  useEffect(() => () => abortRef.current?.abort(), []);

  /* Close chat when cart opens */
  useEffect(() => { if (cartOpen) setOpen(false); }, [cartOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const apiMessages = history.map(m => ({
      role:    m.role,
      content: m.content,
    }));

    // Placeholder for streaming response
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: apiMessages }),
        signal:  abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            content: "Sorry, something went wrong. Please try again or email awtickets@outlook.com.",
          };
          return copy;
        });
      }
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <>
      {/* ── Chat panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position:      "fixed",
              bottom:        "5.5rem",
              right:         "1.5rem",
              width:         "min(380px, calc(100vw - 2rem))",
              height:        "min(540px, calc(100vh - 8rem))",
              zIndex:        9998,
              display:       "flex",
              flexDirection: "column",
              borderRadius:  "16px",
              border:        "1px solid rgba(6,182,212,0.22)",
              background:    "linear-gradient(160deg, rgba(7,9,15,0.98) 0%, rgba(5,6,12,0.99) 100%)",
              boxShadow:     "0 0 0 1px rgba(6,182,212,0.08), 0 32px 80px rgba(0,0,0,0.80)",
              overflow:      "hidden",
            }}
          >
            {/* Header */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "1rem 1.25rem",
              borderBottom:   "1px solid rgba(237,233,225,0.07)",
              background:     "rgba(6,182,212,0.03)",
              flexShrink:     0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width:          "32px",
                  height:         "32px",
                  borderRadius:   "50%",
                  background:     "rgba(6,182,212,0.12)",
                  border:         "1px solid rgba(6,182,212,0.30)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  flexShrink:     0,
                }}>
                  <MessageCircle style={{ width: "14px", height: "14px", color: CYAN }} strokeWidth={1.75} />
                </div>
                <div>
                  <p style={{ fontFamily: I, fontWeight: 600, fontSize: "0.875rem", color: "rgba(237,233,225,0.92)", margin: 0, lineHeight: 1.2 }}>
                    Support Chat
                  </p>
                  <p style={{ fontFamily: I, fontSize: "11px", color: "rgba(161,161,170,0.55)", margin: 0 }}>
                    Awakenings Resale
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "rgba(237,233,225,0.35)", transition: "color 0.2s ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(237,233,225,0.80)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(237,233,225,0.35)")}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>

              {/* Welcome state */}
              {isEmpty && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p style={{ fontFamily: I, fontSize: "0.875rem", lineHeight: 1.7, color: "rgba(161,161,170,0.78)", marginBottom: "1.25rem" }}>
                    Hi! I can help with questions about tickets, delivery, camping, or festival entry. What would you like to know?
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        style={{
                          textAlign:     "left",
                          background:    "rgba(6,182,212,0.05)",
                          border:        "1px solid rgba(6,182,212,0.14)",
                          borderRadius:  "8px",
                          padding:       "8px 12px",
                          fontFamily:    I,
                          fontSize:      "0.8125rem",
                          color:         "rgba(237,233,225,0.65)",
                          cursor:        "pointer",
                          transition:    "all 0.2s ease",
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget;
                          el.style.background   = "rgba(6,182,212,0.10)";
                          el.style.borderColor  = "rgba(6,182,212,0.28)";
                          el.style.color        = "rgba(237,233,225,0.90)";
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget;
                          el.style.background  = "rgba(6,182,212,0.05)";
                          el.style.borderColor = "rgba(6,182,212,0.14)";
                          el.style.color       = "rgba(237,233,225,0.65)";
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message bubbles */}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display:       "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div style={{
                    maxWidth:     "82%",
                    padding:      "0.625rem 0.875rem",
                    borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                    background:   msg.role === "user"
                      ? "rgba(6,182,212,0.14)"
                      : "rgba(237,233,225,0.07)",
                    border:       msg.role === "user"
                      ? "1px solid rgba(6,182,212,0.25)"
                      : "1px solid rgba(237,233,225,0.08)",
                    fontFamily:   I,
                    fontSize:     "0.875rem",
                    lineHeight:   1.65,
                    color:        msg.role === "user" ? "rgba(237,233,225,0.92)" : "rgba(237,233,225,0.82)",
                    whiteSpace:   "pre-wrap",
                    wordBreak:    "break-word",
                  }}>
                    {msg.content || (
                      <span style={{ display: "flex", gap: "4px", alignItems: "center", opacity: 0.5 }}>
                        <span style={{ animation: "bounce 1.2s ease infinite 0s",    display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "currentColor" }} />
                        <span style={{ animation: "bounce 1.2s ease infinite 0.2s", display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "currentColor" }} />
                        <span style={{ animation: "bounce 1.2s ease infinite 0.4s", display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: "currentColor" }} />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div style={{
              padding:      "0.875rem 1.25rem 1rem",
              borderTop:    "1px solid rgba(237,233,225,0.07)",
              background:   "rgba(4,5,10,0.60)",
              flexShrink:   0,
            }}>
              <div style={{
                display:      "flex",
                alignItems:   "flex-end",
                gap:          "8px",
                background:   "rgba(237,233,225,0.04)",
                border:       "1px solid rgba(237,233,225,0.10)",
                borderRadius: "10px",
                padding:      "0.625rem 0.625rem 0.625rem 0.875rem",
                transition:   "border-color 0.2s ease",
              }}
              onFocusCapture={e => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.35)")}
              onBlurCapture={e  => (e.currentTarget.style.borderColor = "rgba(237,233,225,0.10)")}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about tickets, delivery, camping…"
                  rows={1}
                  disabled={loading}
                  aria-label="Chat message input"
                  style={{
                    flex:       1,
                    background: "transparent",
                    border:     "none",
                    outline:    "none",
                    resize:     "none",
                    fontFamily: I,
                    fontSize:   "0.875rem",
                    color:      "rgba(237,233,225,0.85)",
                    lineHeight: 1.5,
                    maxHeight:  "96px",
                    overflowY:  "auto",
                  }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                  style={{
                    width:          "32px",
                    height:         "32px",
                    borderRadius:   "8px",
                    border:         "none",
                    background:     !input.trim() || loading ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.85)",
                    cursor:         !input.trim() || loading ? "not-allowed" : "pointer",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    flexShrink:     0,
                    transition:     "background 0.2s ease",
                  }}
                >
                  {loading
                    ? <Loader2 style={{ width: "14px", height: "14px", color: "rgba(237,233,225,0.40)", animation: "spin 1s linear infinite" }} />
                    : <Send    style={{ width: "13px", height: "13px", color: !input.trim() ? "rgba(237,233,225,0.25)" : "#fff" }} strokeWidth={2} />
                  }
                </button>
              </div>
              <p style={{ fontFamily: I, fontSize: "10px", color: "rgba(161,161,170,0.30)", textAlign: "center", marginTop: "0.5rem", marginBottom: 0 }}>
                awtickets@outlook.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button ────────────────────────────── */}
      <AnimatePresence>
        {!cartOpen && (
          <motion.button
            key="chat-trigger"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? "Close chat" : "Open support chat"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              position:       "fixed",
              bottom:         "1.5rem",
              right:          "1.5rem",
              zIndex:         9999,
              width:          "52px",
              height:         "52px",
              borderRadius:   "50%",
              border:         "1px solid rgba(6,182,212,0.45)",
              background:     open ? "rgba(6,182,212,0.20)" : "rgba(6,182,212,0.12)",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              boxShadow:      "0 0 0 0 rgba(6,182,212,0)",
              transition:     "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background  = "rgba(6,182,212,0.22)";
              el.style.borderColor = "rgba(6,182,212,0.70)";
              el.style.boxShadow   = "0 0 24px rgba(6,182,212,0.18)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background  = open ? "rgba(6,182,212,0.20)" : "rgba(6,182,212,0.12)";
              el.style.borderColor = "rgba(6,182,212,0.45)";
              el.style.boxShadow   = "0 0 0 0 rgba(6,182,212,0)";
            }}
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.span key="x"
                  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X style={{ width: "20px", height: "20px", color: CYAN }} />
                </motion.span>
              ) : (
                <motion.span key="chat"
                  initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <MessageCircle style={{ width: "22px", height: "22px", color: CYAN }} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>

      {/* CSS keyframes for typing dots + spinner */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
