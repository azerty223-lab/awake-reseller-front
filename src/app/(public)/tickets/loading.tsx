export default function TicketsLoading() {
  return (
    <div className="min-h-screen bg-[#050507]">
      {/* Hero banner skeleton */}
      <div className="h-64 sm:h-80 bg-gradient-to-b from-[#0A0A0D] to-[#050507] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Toolbar skeleton */}
        <div
          className="rounded-2xl mb-8 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Filter pills row */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            {[48, 64, 60, 52, 68, 56].map((w, i) => (
              <div
                key={i}
                className="h-6 rounded-full animate-pulse"
                style={{ width: `${w}px`, background: i === 0 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)" }}
              />
            ))}
          </div>
          {/* Search row */}
          <div className="flex items-center gap-3 px-4 py-2.5">
            <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>

        {/* Trust chips skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[140, 120, 100, 92].map((w, i) => (
            <div key={i} className="h-7 rounded-lg animate-pulse" style={{ width: `${w}px`, background: "rgba(6,182,212,0.06)" }} />
          ))}
        </div>

        {/* Card grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden animate-pulse"
              style={{
                background: "linear-gradient(158deg, #0F1014 0%, #0C0D11 100%)",
                border:     "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="p-5 space-y-[18px]">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="h-5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                {/* Title */}
                <div className="space-y-1.5">
                  <div className="h-[15px] w-3/4 rounded-md" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-3 w-2/5 rounded-md"    style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                {/* Price */}
                <div className="space-y-1.5">
                  <div className="h-7 w-28 rounded-md"     style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-3 w-20 rounded-md"     style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
                {/* Metadata */}
                <div className="h-3 w-44 rounded-md"       style={{ background: "rgba(255,255,255,0.05)" }} />
                {/* CTA */}
                <div className="flex gap-2">
                  <div className="flex-1 h-10 rounded-xl"  style={{ background: "rgba(6,182,212,0.12)" }} />
                  <div className="w-10 h-10 rounded-xl"    style={{ background: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
