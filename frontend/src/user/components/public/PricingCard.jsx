import { Check } from "lucide-react";

export default function PricingCard({ tier, onSelect }) {
  const { name, tagline, price, badge, perks, featured } = tier;

  return (
    <div
      className={`relative flex flex-col rounded-[20px] px-[30px] py-[34px] transition-[transform,box-shadow,border-color] duration-[400ms] ${
        featured
          ? "-translate-y-2.5 border border-[#5E94CE]/50 shadow-[0_30px_80px_rgba(23,40,109,0.5)]"
          : "border border-[var(--border)] hover:-translate-y-1.5"
      }`}
      style={{
        background: featured
          ? "linear-gradient(160deg, #17286D, #0A0F2C 80%)"
          : "var(--surface)",
      }}
    >
      {badge ? (
        <span className="mb-[18px] w-fit rounded-full border border-[#5E94CE]/45 bg-[rgba(94,148,206,0.22)] px-3 py-[5px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-[#DDE6F0]">
          {badge}
        </span>
      ) : null}

      <h3 className="font-['Sora'] text-[22px] font-semibold text-[var(--text)]">
        {name}
      </h3>
      <p className="mt-2 text-[13.5px] text-[var(--faint)]">{tagline}</p>

      <div className="my-6 flex items-baseline gap-1.5">
        <span className="font-['Sora'] text-5xl font-bold tracking-[-0.03em] text-[var(--text)]">
          {price}
        </span>
        <span className="text-[15px] text-[var(--muted)]">€ / place</span>
      </div>

      <div className="mb-[30px] flex flex-col gap-[13px]">
        {perks.map((perk) => (
          <div
            key={perk}
            className="flex items-center gap-[11px] text-[14.5px] text-[var(--muted)]"
          >
            <Check
              className="h-[17px] w-[17px] shrink-0 text-[#5E94CE]"
              strokeWidth={2.4}
            />
            {perk}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onSelect?.(tier)}
        className={`mt-auto w-full rounded-xl py-[15px] font-['Sora'] text-[14.5px] font-semibold transition-colors ${
          featured
            ? "bg-[#F9F9F9] text-[#0A0F2C] hover:bg-white"
            : "bg-[var(--accent)] text-white hover:bg-[var(--accent2)]"
        }`}
      >
        Réserver à ce tarif
      </button>
    </div>
  );
}
