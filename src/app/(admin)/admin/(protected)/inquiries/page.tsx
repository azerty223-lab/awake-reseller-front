"use client";

import { useEffect, useState, useCallback } from "react";
import { formatDate } from "@/backend/lib/utils";
import { Badge } from "@/frontend/components/ui/Badge";
import { Button } from "@/frontend/components/ui/Button";
import { RefreshCw, Loader2, ChevronDown, ChevronUp, Mail } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;

const statusVariant: Record<string, "warning" | "info" | "success" | "default"> = {
  OPEN: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CLOSED: "default",
};

const NEXT_STATUS: Record<string, string> = {
  OPEN: "IN_PROGRESS",
  IN_PROGRESS: "RESOLVED",
  RESOLVED: "CLOSED",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const url = filter === "ALL" ? "/api/inquiries" : `/api/inquiries?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setInquiries(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchInquiries();
  };

  return (
    <div className="p-6 lg:p-8 pt-20 lg:pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Inquiries</h1>
          <p className="text-zinc-500 text-sm">{inquiries.length} inquiries</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchInquiries} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === s
                ? "bg-[#c9a84c] text-black"
                : "bg-[#111111] border border-[#2a2a2a] text-zinc-400 hover:text-white"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.length === 0 && (
            <p className="text-zinc-600 text-sm text-center py-12">No inquiries found</p>
          )}
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden hover:border-[#3a3a3a] transition-colors"
            >
              <button
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-medium text-sm truncate">{inq.subject}</p>
                    <Badge variant={statusVariant[inq.status] ?? "default"} size="sm">
                      {inq.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-zinc-500 text-xs">
                    {inq.name} · {inq.email} · {formatDate(inq.createdAt)}
                  </p>
                </div>
                {expanded === inq.id ? (
                  <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
              </button>

              {expanded === inq.id && (
                <div className="px-5 pb-5 border-t border-[#1a1a1a]">
                  <div className="bg-[#0a0a0a] rounded-xl p-4 mb-4 mt-4">
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{inq.message}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${inq.subject}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c9a84c]/10 border border-[#c9a84c]/25 text-[#c9a84c] text-xs font-medium hover:bg-[#c9a84c]/20 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Reply via Email
                    </a>
                    {NEXT_STATUS[inq.status] && (
                      <button
                        onClick={() => updateStatus(inq.id, NEXT_STATUS[inq.status])}
                        className="px-3 py-2 rounded-lg bg-[#161616] border border-[#2a2a2a] text-zinc-400 text-xs font-medium hover:text-white hover:border-[#3a3a3a] transition-colors"
                      >
                        Mark as {NEXT_STATUS[inq.status].replace("_", " ")}
                      </button>
                    )}
                    {inq.status !== "CLOSED" && (
                      <button
                        onClick={() => updateStatus(inq.id, "CLOSED")}
                        className="px-3 py-2 rounded-lg bg-[#161616] border border-[#2a2a2a] text-zinc-400 text-xs font-medium hover:text-white hover:border-[#3a3a3a] transition-colors"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
