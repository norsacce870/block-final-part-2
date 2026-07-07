const DOW_LABELS = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const MONTH_LABELS = [
  "Jan.", "Fév.", "Mars", "Avr.", "Mai", "Juin",
  "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc.",
];

export default function ScreeningDateChips({ dates, selectedDate, onSelect }) {
  return (
    <div className="rail mb-6 flex gap-2.5 overflow-x-auto pb-2">
      {dates.map((dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        const active = dateStr === selectedDate;
        return (
          <button
            key={dateStr}
            type="button"
            onClick={() => onSelect(dateStr)}
            className="flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-3.5 py-3 transition-all duration-[250ms]"
            style={{
              minWidth: "68px",
              border: active ? "1px solid var(--accent2)" : "1px solid var(--border)",
              backgroundColor: active ? "var(--accent)" : "var(--chip)",
              color: active ? "#fff" : "var(--muted)",
            }}
          >
            <span className="text-[11px] uppercase tracking-[0.06em] opacity-70">
              {DOW_LABELS[d.getDay()]}
            </span>
            <span className="font-['Sora'] text-xl font-bold leading-none">
              {String(d.getDate()).padStart(2, "0")}
            </span>
            <span className="text-[11px] opacity-70">
              {MONTH_LABELS[d.getMonth()]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function formatDateLabel(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${DOW_LABELS[d.getDay()]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;
}