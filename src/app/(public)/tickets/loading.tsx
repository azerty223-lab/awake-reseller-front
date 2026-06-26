export default function TicketsLoading() {
  return (
    <div className="min-h-screen bg-[#050507]">
      {/* Hero skeleton */}
      <div className="h-64 sm:h-80 bg-[#0A0A0D] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Toolbar skeleton */}
        <div className="flex gap-6 mb-8 pb-3 border-b border-white/[0.06]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-white/[0.06] animate-pulse" style={{ width: `${40 + i * 8}px` }} />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{
                background: "linear-gradient(158deg, #101115 0%, #0C0D10 100%)",
                border:     "1px solid rgba(255,255,255,0.06)",
                height:     "220px",
              }}
            >
              <div className="h-full p-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-3 w-20 rounded bg-white/[0.06]" />
                  <div className="h-5 w-3/4 rounded bg-white/[0.06]" />
                  <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
                </div>
                <div className="space-y-2">
                  <div className="h-7 w-24 rounded bg-white/[0.06]" />
                  <div className="h-9 rounded-xl bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
