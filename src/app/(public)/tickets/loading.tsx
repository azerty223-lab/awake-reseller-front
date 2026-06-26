export default function TicketsLoading() {
  return (
    <div className="min-h-screen bg-[#050507]">
      <div className="h-64 sm:h-80 bg-gradient-to-b from-[#0C0C10] to-[#050507] animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {[48, 64, 60, 52, 68].map((w, i) => (
            <div key={i} className="h-7 rounded-full animate-pulse"
              style={{ width: `${w}px`, background: i === 0 ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)" }} />
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col animate-pulse"
              style={{ background: "#141418", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
                  <div className="h-2.5 w-16 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>
                <div className="h-3 w-14 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
              </div>

              {/* Body */}
              <div className="px-5 pb-4 space-y-2">
                <div className="h-[15px] w-3/4 rounded"    style={{ background: "rgba(255,255,255,0.09)" }} />
                <div className="h-3 w-2/5 rounded mb-3"    style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-6 w-28 rounded mt-4"     style={{ background: "rgba(255,255,255,0.09)" }} />
                <div className="h-3 w-32 rounded mt-1"     style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3 w-40 rounded mt-2"     style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.16)" }}>
                <div className="flex-1 h-9 rounded-lg" style={{ background: "rgba(6,182,212,0.10)" }} />
                <div className="h-3 w-16 rounded"     style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
