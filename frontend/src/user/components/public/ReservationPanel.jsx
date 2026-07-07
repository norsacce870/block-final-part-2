import { Minus, Plus, ShieldCheck, ArrowRight } from "lucide-react";
import { formatDateLabel } from "@/user/components/public/ScreeningDateChips";
import { useAuth } from "@/context/AuthContext";

export function ReservationSidebar({
  filmTitle,
  selectedDate,
  selectedScreening,
  qty,
  onIncrement,
  onDecrement,
  onReserve,
}) {
  const { isAuthenticated } = useAuth();
  const price = Number(selectedScreening?.room?.price ?? 0);
  const total = price * qty;
  const btnLabel = !isAuthenticated()
    ? "Se connecter pour réserver"
    : "Réserver";

  return (
    <aside className="sticky top-[92px] max-[980px]:static">
      <div
        className="overflow-hidden rounded-[20px] border shadow-[0_30px_70px_rgba(0,0,0,0.4)]"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
      >
        <div
          className="border-b px-6 py-[22px]"
          style={{
            borderColor: "var(--border)",
            background: "linear-gradient(135deg, rgba(23,40,109,.5), transparent)",
          }}
        >
          <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--accent2)]">
            Votre réservation
          </div>
          <div className="mt-1.5 font-['Sora'] text-xl font-bold text-[var(--text)]">
            {filmTitle}
          </div>
        </div>

        <div className="p-6">
          {selectedScreening ? (
            <div className="mb-[22px] flex flex-col gap-3.5">
              <Row label="Date" value={selectedDate ? formatDateLabel(selectedDate) : "—"} />
              <Row label="Séance" value={selectedScreening.time} />
              <Row label="Salle" value={selectedScreening.room?.name ?? "—"} />
            </div>
          ) : (
            <p className="mb-[22px] text-sm text-[var(--faint)]">
              Choisissez une séance ci-contre pour continuer.
            </p>
          )}

          <div
            className="mb-5 flex items-center justify-between rounded-[13px] border px-4 py-3.5"
            style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)" }}
          >
            <span className="text-sm font-medium text-[var(--text)]">Places</span>
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={onDecrement}
                aria-label="Moins"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--accent2)]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-[18px] text-center font-['Sora'] text-lg font-bold text-[var(--text)]">
                {qty}
              </span>
              <button
                type="button"
                onClick={onIncrement}
                aria-label="Plus"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:border-[var(--accent2)]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="mb-5 flex items-baseline justify-between">
            <span className="text-sm text-[var(--faint)]">Total</span>
            <span className="font-['Sora'] text-[30px] font-bold tracking-[-0.02em] text-[var(--text)]">
              {total.toFixed(2).replace(/\.00$/, "")} €
            </span>
          </div>

          <button
            type="button"
            disabled={!selectedScreening}
            onClick={onReserve}
            className="flex w-full items-center justify-center gap-2.5 rounded-[13px] py-4 font-['Sora'] text-[15.5px] font-semibold text-white shadow-[0_12px_32px_rgba(58,110,165,0.4)] transition-all hover:-translate-y-0.5 hover:bg-[var(--accent2)] hover:shadow-[0_16px_42px_rgba(58,110,165,0.55)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {btnLabel}
            <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.2} />
          </button>

          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-[var(--faint)]">
            <ShieldCheck className="h-[13px] w-[13px]" strokeWidth={1.8} />
            Annulation gratuite jusqu'à 2h avant
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileReserveBar({ selectedDate, selectedScreening, qty, onReserve }) {
  if (!selectedScreening) return null;
  const total = Number(selectedScreening.room?.price ?? 0) * qty;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[70] hidden items-center justify-between gap-3.5 border-t px-5 py-3.5 backdrop-blur-[16px] max-[980px]:flex"
      style={{ backgroundColor: "var(--nav-bg2, rgba(7,11,28,0.92))", borderColor: "var(--border)" }}
    >
      <div>
        <div className="text-xs text-[var(--faint)]">
          {selectedDate ? formatDateLabel(selectedDate) : ""} · {selectedScreening.time}
        </div>
        <div className="font-['Sora'] text-xl font-bold text-[var(--text)]">
          {total.toFixed(2).replace(/\.00$/, "")} €
        </div>
      </div>
      <button
        type="button"
        onClick={onReserve}
        className="max-w-[220px] flex-1 rounded-[13px] py-[15px] font-['Sora'] text-[15px] font-semibold text-white"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Réserver · {qty} place{qty > 1 ? "s" : ""}
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--faint)]">{label}</span>
      <span className="font-semibold text-[var(--text)]">{value}</span>
    </div>
  );
}