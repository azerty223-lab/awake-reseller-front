export default function TicketsLoading() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="h-64 sm:h-80 bg-gradient-to-b from-[#0A0A0D] to-[#050507] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Toolbar skeleton */}
        <div className="mb-8 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(5,5,7,0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {[48, 64, 60, 52, 68, 56].map((w, i) => (
              <div key={i} className="h-6 rounded-full animate-pulse" style={{ width: `${w}px`, background: i === 0 ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "rgba(5,5,7,0.90)" }}>
            <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>

        {/* Trust chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[140, 120, 100, 92].map((w, i) => (
            <div key={i} className="h-7 rounded-lg animate-pulse" style={{ width: `${w}px`, background: "rgba(6,182,212,0.06)" }} />
          ))}
        </div>

        {/* Card grid — skeleton reflects the 4-zone layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden animate-pulse"
              style={{
                background: "#0D0F14", borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: "4px solid rgba(255,255,255,0.10)",
              }}
            >
              {/* Zone 1: header */}
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.03)" }}>
                <div className="h-5 w-20 rounded-md" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="h-4 w-16 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              {/* Zone 2: content */}
              <div className="px-5 py-4 space-y-2">
                <div className="h-[17px] w-3/4 rounded-md" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="h-3 w-2/5 rounded-md"     style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-8 w-32 rounded-md mt-4" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="h-3 w-24 rounded-md"      style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              {/* Zone 3: trust */}
              <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.025)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="h-3 w-32 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3 w-24 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
              {/* Zone 4: CTA */}
              <div className="flex gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.22)" }}>
                <div className="flex-1 h-10 rounded-lg" style={{ background: "rgba(6,182,212,0.12)" }} />
                <div className="w-20 h-10 rounded-lg"   style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
