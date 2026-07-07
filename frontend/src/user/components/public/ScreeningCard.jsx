import { DoorOpen } from "lucide-react";

function seatColor(seats) {
  if (seats <= 30) return "#E0A458";
  if (seats <= 70) return "#5E94CE";
  return "#7FB98E";
}

export default function ScreeningCard({ screening, active, onSelect }) {
  const format = screening.room?.format;
  const isImax = format === "imax";
  const isVip = format === "vip";

  const formatLabel = isImax ? "IMAX" : isVip ? "VIP Lounge" : "Standard";
  const formatBg = isImax
    ? "rgba(94,148,206,.22)"
    : isVip
    ? "rgba(224,164,88,.18)"
    : "var(--chip)";
  const formatBorder = isImax
    ? "rgba(94,148,206,.45)"
    : isVip
    ? "rgba(224,164,88,.4)"
    : "var(--border)";
  const formatColor = isImax ? "#DDE6F0" : isVip ? "#E0A458" : "var(--muted)";
  const color = seatColor(screening.seats_remaining);

  return (
    <button
      type="button"
      onClick={() => onSelect(screening)}
      className="scard text-left transition-[transform,border-color,background,box-shadow] duration-[350ms]"
      style={{
        padding: "20px",
        borderRadius: "16px",
        border: active ? "1.5px solid var(--accent2)" : "1px solid var(--border)",
        background: active
          ? "linear-gradient(160deg, rgba(23,40,109,.55), var(--surface))"
          : "var(--surface)",
        boxShadow: active ? "0 16px 44px rgba(23,40,109,.45)" : "none",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-['Sora'] text-2xl font-bold tracking-[-0.01em] text-[var(--text)]">
          {screening.time}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em]"
          style={{
            background: formatBg,
            border: `1px solid ${formatBorder}`,
            color: formatColor,
          }}
        >
          {formatLabel}
        </span>
      </div>

      <div className="mt-3.5 flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
        <DoorOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
        {screening.room?.name}
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-[var(--border)] pt-3.5">
        <span className="flex items-center gap-1.5 text-[12.5px]" style={{ color }}>
          <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />
          {screening.seats_remaining} places
        </span>
        <span className="font-['Sora'] text-base font-bold text-[var(--text)]">
          {Number(screening.room?.price ?? 0).toFixed(2).replace(/\.00$/, "")} €
        </span>
      </div>
    </button>
  );
}