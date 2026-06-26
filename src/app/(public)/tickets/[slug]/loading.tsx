export default function TicketDetailLoading() {
  return (
    <div className="min-h-screen bg-[#030305] py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back link */}
        <div className="h-4 w-20 rounded bg-white/[0.06] mb-8 animate-pulse" />

        <div className="grid md:grid-cols-[1fr_348px] gap-10">
          {/* Left column */}
          <div className="order-2 md:order-1 space-y-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-4 w-24 rounded bg-white/[0.06]" />
              <div className="h-10 w-3/4 rounded bg-white/[0.07]" />
              <div className="h-4 w-40 rounded bg-white/[0.05]" />
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-white/[0.05]" />
              <div className="h-3 w-5/6 rounded bg-white/[0.05]" />
              <div className="h-3 w-4/6 rounded bg-white/[0.04]" />
            </div>
          </div>

          {/* Right column — purchase panel */}
          <div className="order-1 md:order-2 animate-pulse">
            <div
              className="rounded-xl p-5"
              style={{ background: "#0F1013", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              <div className="space-y-4 mb-5 pb-5 border-b border-white/[0.06]">
                <div className="h-3 w-20 rounded bg-white/[0.06]" />
                <div className="h-10 w-32 rounded bg-white/[0.07]" />
              </div>
              <div className="h-12 rounded-xl bg-white/[0.06]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
