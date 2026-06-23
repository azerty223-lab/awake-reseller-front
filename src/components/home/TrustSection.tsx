import { Shield, CreditCard, ArrowLeftRight, HeadphonesIcon } from "lucide-react";

const trustItems = [
  {
    icon: Shield,
    title: "Verified Seller",
    description:
      "All tickets are legally owned by a private party. We provide proof of purchase and full transparency.",
    color: "#22c55e",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description:
      "Payments processed exclusively through Stripe — the most trusted payment infrastructure in the world.",
    color: "#3b82f6",
  },
  {
    icon: ArrowLeftRight,
    title: "Name Transfer Guaranteed",
    description:
      "We handle the official Awakenings name change process, fully compliant with the festival's transfer policy.",
    color: "#c9a84c",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description:
      "Questions before or after purchase? Our support team responds within hours via email.",
    color: "#a855f7",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-[#c9a84c]" />
            <span className="text-[#c9a84c] text-xs uppercase tracking-widest font-semibold">
              Why Trust Us
            </span>
          </div>
          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold text-white mb-4">
            Buy With Confidence
          </h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            We've built a resale experience you can trust — from verified tickets to secure checkout.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="group bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6 hover:border-[#3a3a3a] transition-all hover:-translate-y-0.5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
