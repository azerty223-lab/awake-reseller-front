import { MapPin, Calendar, Music2, Users } from "lucide-react";

const artists = [
  "Adam Beyer",
  "Charlotte de Witte",
  "Amelie Lens",
  "Richie Hawtin",
  "Sven Väth",
  "Matador",
  "Alignment",
  "I Hate Models",
  "Paula Temple",
  "Boris Brejcha",
  "Enrico Sangiuliano",
  "SPFDJ",
];

const infoCards = [
  {
    icon: Calendar,
    label: "Dates",
    value: "July 10–12, 2026",
    sub: "Friday to Sunday",
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "Hilvarenbeek",
    sub: "North Brabant",
  },
  {
    icon: Users,
    label: "Capacity",
    value: "35,000+",
    sub: "Attendees expected",
  },
  {
    icon: Music2,
    label: "Stages",
    value: "5 Stages",
    sub: "Outdoor & Indoor",
  },
];

export function FestivalInfo() {
  return (
    <section className="py-20 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Music2 className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
              The Festival
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Awakenings 2026
          </h2>
          <p className="text-zinc-500 text-sm max-w-xl mx-auto leading-relaxed">
            Europe's leading techno festival returns to Hilvarenbeek for another unforgettable
            edition. Three days of world-class electronic music across five stages.
          </p>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {infoCards.map(({ icon: Icon, label, value, sub }) => (
            <div
              key={label}
              className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 hover:border-[#c9a84c]/30 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-[#c9a84c]" />
              </div>
              <p className="text-zinc-600 text-xs uppercase tracking-wider mb-1">{label}</p>
              <p className="text-white font-bold text-lg leading-tight">{value}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Lineup */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#c9a84c]/10 flex items-center justify-center">
              <Music2 className="w-4 h-4 text-[#c9a84c]" />
            </div>
            <div>
              <h3 className="text-white font-bold">Confirmed Lineup</h3>
              <p className="text-zinc-500 text-xs">Awakenings Festival 2026 artists</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {artists.map((artist) => (
              <div
                key={artist}
                className="px-4 py-2 rounded-xl bg-[#161616] border border-[#2a2a2a] text-sm font-medium text-zinc-300 hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-all cursor-default"
              >
                {artist}
              </div>
            ))}
            <div className="px-4 py-2 rounded-xl bg-[#c9a84c]/10 border border-[#c9a84c]/30 text-sm font-medium text-[#c9a84c]">
              + Many more TBA
            </div>
          </div>

          <p className="text-zinc-600 text-xs mt-6">
            * Lineup subject to change. All artists confirmed as of announcement.
            Ticket purchase is not dependent on specific artist appearances.
          </p>
        </div>
      </div>
    </section>
  );
}
