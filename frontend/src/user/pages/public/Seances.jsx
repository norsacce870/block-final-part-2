import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, RotateCcw, CalendarDays } from "lucide-react";
import { ThemeProvider, useTheme } from "@/user/context/ThemeProvider";
import Navbar from "@/user/components/public/Navbar";
import Footer from "@/user/components/public/Footer";
import api from "@/api/axios";
import { STORAGE_URL } from "@/utils/storageUrl";

const DOW  = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
const MONS = ["Jan.", "Fév.", "Mars", "Avr.", "Mai", "Juin",
              "Juil.", "Août", "Sep.", "Oct.", "Nov.", "Déc."];

// Generate the next 7 days starting from today
function buildDays() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      iso:   d.toISOString().slice(0, 10),
      dow:   DOW[d.getDay()],
      day:   String(d.getDate()).padStart(2, "0"),
      month: MONS[d.getMonth()],
    });
  }
  return days;
}

const PERIODS = [
  { id: "all",   label: "Tous" },
  { id: "matin", label: "Matin",       range: [0,  12] },
  { id: "aprem", label: "Après-midi",  range: [12, 17] },
  { id: "soir",  label: "Soir",        range: [17, 21] },
  { id: "nuit",  label: "Nuit",        range: [21, 24] },
];

const FORMATS = [
  { id: "all",      label: "Tous" },
  { id: "standard", label: "Standard" },
  { id: "imax",     label: "IMAX" },
  { id: "vip",      label: "VIP Lounge" },
];

// ─── seat colour ──────────────────────────────────────────────────────────────
// Pastel tones read fine on the dark surfaces but drop under 3:1 on the
// near-white --surface2 in light mode, so each status needs a darker variant.
function seatColor(n, theme) {
  if (theme === "dark") {
    if (n > 30) return "#7FB98E";
    if (n > 0)  return "#E0A458";
    return "#E08A7D";
  }
  if (n > 30) return "#256B48";
  if (n > 0)  return "#8A5A12";
  return "#A6362A";
}

// ─── wrapper ──────────────────────────────────────────────────────────────────
export default function Seances() {
  return (
    <ThemeProvider>
      <SeancesContent />
    </ThemeProvider>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
function SeancesContent() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const days = useMemo(buildDays, []);

  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selDate,   setSelDate]     = useState(days[0].iso);
  const [period,    setPeriod]      = useState("all");
  const [format,    setFormat]      = useState("all");

  useEffect(() => {
    setLoading(true);
    api.get("/screenings")
      .then((res) => setScreenings(res.data?.data ?? res.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── filtering ──────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return screenings.filter((s) => {
      // date
      if (s.date !== selDate) return false;

      // period
      if (period !== "all") {
        const h = parseInt(s.time?.slice(0, 2) ?? "0", 10);
        const p = PERIODS.find((p) => p.id === period);
        if (h < p.range[0] || h >= p.range[1]) return false;
      }

      // format
      if (format !== "all" && s.room?.format !== format) return false;

      return true;
    });
  }, [screenings, selDate, period, format]);

  // ── group by film ─────────────────────────────────────────────────────────
  const groups = useMemo(() => {
    const map = new Map();
    for (const s of filtered) {
      const key = String(s.id_film);
      if (!map.has(key)) {
        map.set(key, { film: s.film, sessions: [] });
      }
      map.get(key).sessions.push(s);
    }
    // sort sessions within each group by time
    for (const g of map.values()) {
      g.sessions.sort((a, b) => (a.time > b.time ? 1 : -1));
    }
    return [...map.values()];
  }, [filtered]);

  const total = filtered.length;
  const isEmpty = !loading && groups.length === 0;

  const resetFilters = () => { setPeriod("all"); setFormat("all"); };

  // ── pill style ────────────────────────────────────────────────────────────
  const pillStyle = (active) => ({
    padding: "6px 16px",
    borderRadius: "99px",
    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--muted)",
    fontFamily: "Sora, sans-serif",
    fontWeight: active ? 600 : 400,
    fontSize: "13.5px",
    cursor: "pointer",
    transition: "all .2s",
  });

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Navbar />

      {/* ── Header ── */}
      <header className="relative overflow-hidden pb-0 pt-[128px]">
        {/* Ambient orb */}
        <div
          className="pointer-events-none absolute left-1/2 top-[-30%] h-[560px] w-[1000px] -translate-x-1/2 rounded-full blur-[20px]"
          style={{ background: "radial-gradient(ellipse,rgba(58,110,165,.22),transparent 68%)" }}
        />
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-8">
          {/* Label */}
          <div className="mb-3.5 flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[.28em]" style={{ color: "var(--accent2)" }}>
              Programme de la semaine
            </span>
            <span className="h-px w-7 opacity-50" style={{ background: "#5E94CE" }} />
          </div>

          <h1
            className="font-['Sora'] text-[clamp(38px,5.4vw,64px)] font-bold leading-none tracking-tight"
            style={{ color: "var(--text)" }}
          >
            Séances
          </h1>
          <p className="mb-9 mt-2 text-[16px] font-light" style={{ color: "var(--muted)" }}>
            {loading ? "Chargement…" : `${total} séance${total !== 1 ? "s" : ""} disponible${total !== 1 ? "s" : ""}`}
          </p>

          {/* 7-day strip */}
          <div className="rail flex gap-3 overflow-x-auto pb-3">
            {days.map((d) => {
              const active = d.iso === selDate;
              return (
                <button
                  key={d.iso}
                  type="button"
                  onClick={() => setSelDate(d.iso)}
                  className="flex shrink-0 flex-col items-center gap-1 rounded-[18px] px-4 py-3.5 transition-all duration-200"
                  style={{
                    minWidth: 72,
                    border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                    background: active
                      ? "var(--accent)"
                      : "rgba(168,192,224,.07)",
                    color: active ? "#fff" : "var(--muted)",
                  }}
                >
                  <span className="text-[11px] uppercase tracking-[.08em] opacity-75">{d.dow}</span>
                  <span className="font-['Sora'] text-[22px] font-bold leading-none">{d.day}</span>
                  <span className="text-[11px] opacity-75">{d.month}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Sticky filter bar ── */}
      <div
        className="sticky top-[69px] z-40 mt-6 border-b backdrop-blur-[14px]"
        style={{
          background: theme === "dark" ? "rgba(0,0,0,.7)" : "rgba(249,249,249,.85)",
          borderColor: "var(--border)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-5 px-4 py-4 sm:gap-7 sm:px-8">
          {/* Period */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[.06em]" style={{ color: "var(--muted)" }}>
              Moment
            </span>
            <div className="flex gap-2">
              {PERIODS.map((p) => (
                <button key={p.id} type="button" onClick={() => setPeriod(p.id)} style={pillStyle(period === p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] uppercase tracking-[.06em]" style={{ color: "var(--muted)" }}>
              Format
            </span>
            <div className="flex gap-2">
              {FORMATS.map((f) => (
                <button key={f.id} type="button" onClick={() => setFormat(f.id)} style={pillStyle(format === f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Programme ── */}
      <main className="mx-auto flex max-w-[1280px] flex-col gap-10 px-4 pb-24 pt-12 sm:px-8">
        {loading ? (
          <div className="py-20 text-center text-sm" style={{ color: "var(--muted)" }}>Chargement…</div>
        ) : isEmpty ? (
          /* Empty state */
          <div className="flex flex-col items-center py-20 text-center">
            <span
              className="mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", color: "#5E94CE" }}
            >
              <CalendarDays size={30} strokeWidth={1.6} />
            </span>
            <h3 className="mb-2 font-['Sora'] text-[22px] font-semibold" style={{ color: "var(--text)" }}>
              Aucune séance pour ce filtre
            </h3>
            <p className="mb-6 text-[15px]" style={{ color: "rgba(221,230,240,.55)" }}>
              Essayez un autre moment de la journée ou un autre format.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-2 rounded-full border px-6 py-3 font-['Sora'] text-[14px] font-semibold transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)", background: "transparent" }}
            >
              <RotateCcw size={15} />
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          groups.map(({ film, sessions }) => (
            <article
              key={film?.id_film}
              className="rounded-[22px] border p-7 shadow-[0_20px_60px_rgba(0,0,0,.3)]"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
            >
              {/* Film header */}
              <div className="mb-6 flex items-start gap-5">
                {/* Poster */}
                {film?.poster ? (
                  <img
                    src={`${STORAGE_URL}${film.poster}`}
                    alt={film.title}
                    className="h-[128px] w-[88px] shrink-0 rounded-[13px] object-cover"
                    style={{ border: "1px solid var(--border)" }}
                  />
                ) : (
                  <div
                    className="flex h-[128px] w-[88px] shrink-0 items-end rounded-[13px] p-3"
                    style={{
                      backgroundImage: "repeating-linear-gradient(125deg,rgba(168,192,224,.08) 0 2px,transparent 2px 18px),linear-gradient(160deg,#17286D,#0A0F2C 75%)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span className="font-mono text-[8.5px] uppercase tracking-[.12em]" style={{ color: "rgba(221,230,240,.32)" }}>
                      affiche
                    </span>
                  </div>
                )}

                {/* Film info */}
                <div className="flex-1 min-w-0">
                  <div className="mb-2.5 flex flex-wrap items-center gap-3">
                    <h2
                      className="font-['Sora'] text-[clamp(22px,3vw,30px)] font-bold leading-tight tracking-tight"
                      style={{ color: "var(--text)" }}
                    >
                      {film?.title || "Film"}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {film?.category?.name && (
                      <span
                        className="rounded-full border px-3 py-1 text-[12.5px]"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        {film.category.name}
                      </span>
                    )}
                    {film?.duration_min && (
                      <span
                        className="rounded-full border px-3 py-1 text-[12.5px]"
                        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
                      >
                        {Math.floor(film.duration_min / 60)}h{film.duration_min % 60 ? ` ${film.duration_min % 60}` : ""}
                      </span>
                    )}
                    {film?.id_film && (
                      <Link
                        to={`/films/${film.id_film}`}
                        className="ml-1 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:opacity-80"
                        style={{ color: "var(--accent2)" }}
                      >
                        Fiche du film
                        <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Sessions grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(216px,1fr))]">
                {sessions.map((s) => {
                  const isImax = s.room?.format === "imax";
                  const isVip  = s.room?.format === "vip";
                  const formatLabel = isImax ? "IMAX" : isVip ? "VIP Lounge" : "Standard";
                  const tagBg    = isImax ? "rgba(94,148,206,.2)"  : isVip ? "rgba(224,164,88,.18)"  : "var(--chip, rgba(168,192,224,.1))";
                  const tagColor = isImax ? "#DDE6F0" : isVip ? "#E0A458" : "var(--muted)";
                  const tagBorder = isImax ? "rgba(94,148,206,.4)" : isVip ? "rgba(224,164,88,.35)" : "var(--border)";
                  const sc = seatColor(s.seats_remaining, theme);

                  return (
                    <div
                      key={s.id_screening}
                      className="flex flex-col rounded-[16px] border p-5"
                      style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-['Sora'] text-[27px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
                          {s.time?.slice(0, 5)}
                        </span>
                        <span
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                          style={{ background: tagBg, border: `1px solid ${tagBorder}`, color: tagColor }}
                        >
                          {formatLabel}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-[13px]" style={{ color: "var(--muted)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 20h10M12 18v2"/>
                        </svg>
                        {s.room?.name || "—"}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
                        <span className="flex items-center gap-1.5 text-[12.5px]" style={{ color: sc }}>
                          <span className="h-[7px] w-[7px] rounded-full" style={{ background: sc }} />
                          {s.seats_remaining} places
                        </span>
                        <span className="font-['Sora'] text-[16px] font-bold" style={{ color: "var(--text)" }}>
                          {Number(s.room?.price ?? 0).toFixed(2).replace(/\.00$/, "")} €
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/films/${s.id_film}`)}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-[11px] py-3 font-['Sora'] text-[14px] font-semibold text-white transition-colors"
                        style={{ backgroundColor: "var(--accent)", border: "none" }}
                      >
                        Réserver
                        <ArrowRight size={15} strokeWidth={2.2} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}