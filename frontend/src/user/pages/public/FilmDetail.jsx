import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Play, ArrowLeft } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/user/context/ThemeProvider";
import { ToastProvider, useToast } from "@/user/context/ToastProvider";
import Navbar from "@/user/components/public/Navbar";
import Footer from "@/user/components/public/Footer";
import Toast from "@/user/components/public/Toast";
import TrailerModal from "@/user/components/public/TrailerModal";
import ScreeningDateChips from "@/user/components/public/ScreeningDateChips";
import ScreeningCard from "@/user/components/public/ScreeningCard";
import { ReservationSidebar, MobileReserveBar } from "@/user/components/public/ReservationPanel";
import { DEMO_FILM, DEMO_SCREENINGS } from "@/user/data/filmDetailDemo";
import { STORAGE_URL } from "@/utils/storageUrl";

export default function FilmDetail() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FilmDetailContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

function FilmDetailContent() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [film, setFilm] = useState(DEMO_FILM);
  const [screenings, setScreenings] = useState(DEMO_SCREENINGS);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedScreeningId, setSelectedScreeningId] = useState(null);
  const [qty, setQty] = useState(2);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/films/${id}`)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        if (data) setFilm(data);
      })
      .catch(() => {});

    api
      .get("/screenings", { params: { id_film: id } })
      .then((res) => {
        const forFilm = res.data?.data ?? res.data ?? [];
        if (forFilm.length) setScreenings(forFilm);
      })
      .catch(() => {});
  }, [id]);

  // Group screenings by date, sorted chronologically.
  const screeningsByDate = useMemo(() => {
    const map = {};
    for (const s of screenings) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    return map;
  }, [screenings]);

  const dates = useMemo(
    () => Object.keys(screeningsByDate).sort(),
    [screeningsByDate]
  );

  // Default to the first available date once screenings load.
  useEffect(() => {
    if (dates.length && !selectedDate) {
      setSelectedDate(dates[0]);
    }
  }, [dates, selectedDate]);

  const sessionsForDate = screeningsByDate[selectedDate] ?? [];

  // Default to the first session of the selected date.
  useEffect(() => {
    if (sessionsForDate.length) {
      const stillValid = sessionsForDate.some(
        (s) => s.id_screening === selectedScreeningId
      );
      if (!stillValid) setSelectedScreeningId(sessionsForDate[0].id_screening);
    } else {
      setSelectedScreeningId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, screenings]);

  const selectedScreening =
    sessionsForDate.find((s) => s.id_screening === selectedScreeningId) ?? null;

  const posterUrl = film.poster ? `${STORAGE_URL}${film.poster}` : null;

  const handleReserve = async () => {
    if (!selectedScreening) return;

    // Gate: redirect to login page with a "from" param so the user
    // comes back here automatically after signing in.
    if (!isAuthenticated()) {
      navigate(`/connexion?from=/films/${id}`);
      return;
    }

    try {
      const res = await api.post("/bookings", {
        id_screening: selectedScreening.id_screening,
        seats_count: qty,
      });
      const booking = res.data;
      const expiresLabel = booking.expires_at
        ? new Date(booking.expires_at).toLocaleString("fr-FR", {
            day: "2-digit", month: "short",
            hour: "2-digit", minute: "2-digit",
          })
        : "";
      showToast(
        `Réservation enregistrée ✓ — En attente de confirmation${expiresLabel ? ` · Expire le ${expiresLabel}` : ""}`
      );
      setTimeout(() => navigate("/profil"), 2200);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "";
      showToast(
        msg.toLowerCase().includes("seat") || msg.toLowerCase().includes("place")
          ? "Plus assez de places disponibles pour cette séance."
          : msg || "Erreur lors de la réservation."
      );
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden pb-24 font-sans max-[980px]:pb-24"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      {/* Banner */}
      <header className="relative h-[38vh] min-h-[260px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 100% at 72% 18%, #17286D 0%, #0A0F2C 48%, #000 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(168,192,224,.05) 0 2px, transparent 2px 26px)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[50%]"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        />
      </header>

      {/* Info row */}
      <section className="relative z-[5] mx-auto max-w-[1280px] px-4 sm:px-8">
        <div className="flex flex-col items-start gap-6 min-[981px]:flex-row min-[981px]:items-end min-[981px]:gap-10">
          <div
            className="relative -mt-[120px] w-[170px] shrink-0 overflow-hidden rounded-[18px] border shadow-[0_40px_90px_rgba(0,0,0,0.6)] min-[981px]:-mt-[150px] min-[981px]:w-[248px]"
            style={{ aspectRatio: "2/3", borderColor: "rgba(94,148,206,.25)" }}
          >
            {posterUrl ? (
              <img src={posterUrl} alt={film.title} className="h-full w-full object-cover" />
            ) : (
              <div
                className="flex h-full w-full flex-col justify-end p-[22px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(125deg, rgba(168,192,224,.08) 0 2px, transparent 2px 22px), linear-gradient(160deg, #17286D, #0A0F2C 72%)",
                }}
              >
                <span className="mb-auto font-mono text-[9.5px] uppercase tracking-[0.14em] text-[rgba(221,230,240,0.34)]">
                  affiche
                </span>
                <span className="font-['Sora'] text-xl font-bold leading-[1.04] text-white">
                  {film.title}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <Link
              to="/accueil-preview"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Accueil
            </Link>

            <h1 className="mb-[18px] font-['Sora'] text-[clamp(32px,5.4vw,68px)] font-bold leading-none tracking-[-0.02em] text-[var(--text)]">
              {film.title}
            </h1>

            <div className="mb-5 flex flex-wrap items-center gap-2">
              {film.category?.name && <Pill emphasis>{film.category.name}</Pill>}
              {film.duration_min && <Pill>{formatDuration(film.duration_min)}</Pill>}
            </div>

            <button
              type="button"
              onClick={() => setTrailerOpen(true)}
              className="inline-flex items-center gap-2.5 rounded-full border px-6 py-3 font-['Sora'] text-[14.5px] font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface2)]"
              style={{ borderColor: "var(--border)" }}
            >
              <Play className="h-[15px] w-[15px]" fill="currentColor" />
              Bande-annonce
            </button>
          </div>
        </div>
      </section>

      {/* Detail grid */}
      <section className="mx-auto max-w-[1280px] px-4 py-14 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 items-start gap-9 min-[981px]:grid-cols-[1fr_366px] min-[981px]:gap-[52px]">
          {/* Left column */}
          <div>
            {/* Facts strip */}
            <div
              className="mb-10 grid overflow-hidden rounded-2xl border"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1px",
                backgroundColor: "var(--border)",
                borderColor: "var(--border)",
              }}
            >
              {buildFacts(film).map((f) => (
                <div key={f.label} className="px-[22px] py-5" style={{ backgroundColor: "var(--surface)" }}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent2)]">
                    {f.label}
                  </div>
                  <div className="mt-2 text-[15px] font-semibold text-[var(--text)]">
                    {f.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Synopsis */}
            {film.synopsis && (
              <div className="mb-11">
                <h2 className="mb-[18px] font-['Sora'] text-2xl font-semibold tracking-[-0.01em] text-[var(--text)]">
                  Synopsis
                </h2>
                <p className="text-[16.5px] font-light leading-[1.78] text-[var(--muted)]">
                  {film.synopsis}
                </p>
                {film.actors && (
                  <p className="mt-4 text-sm text-[var(--faint)]">
                    <span className="font-medium text-[var(--muted)]">Avec </span>
                    {film.actors}
                  </p>
                )}
              </div>
            )}

            {/* Showtimes */}
            <div id="seances">
              <h2 className="mb-2 font-['Sora'] text-2xl font-semibold tracking-[-0.01em] text-[var(--text)]">
                Séances disponibles
              </h2>

              {dates.length === 0 ? (
                <p className="text-sm text-[var(--faint)]">
                  Aucune séance programmée pour ce film actuellement.
                </p>
              ) : (
                <>
                  <p className="mb-[22px] text-sm text-[var(--faint)]">
                    Choisissez une date, puis une séance.
                  </p>
                  <ScreeningDateChips
                    dates={dates}
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                  <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 min-[700px]:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
                    {sessionsForDate.map((s) => (
                      <ScreeningCard
                        key={s.id_screening}
                        screening={s}
                        active={s.id_screening === selectedScreeningId}
                        onSelect={() => setSelectedScreeningId(s.id_screening)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right: reservation */}
          <ReservationSidebar
            filmTitle={film.title}
            selectedDate={selectedDate}
            selectedScreening={selectedScreening}
            qty={qty}
            onIncrement={() => setQty((q) => Math.min(10, q + 1))}
            onDecrement={() => setQty((q) => Math.max(1, q - 1))}
            onReserve={handleReserve}
          />
        </div>
      </section>

      <Footer />

      <MobileReserveBar
        selectedDate={selectedDate}
        selectedScreening={selectedScreening}
        qty={qty}
        onReserve={handleReserve}
      />

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        film={{
          title: film.title,
          genre: film.category?.name,
          runtime: formatDuration(film.duration_min),
          year: film.release_date ? new Date(film.release_date).getFullYear() : "",
          trailerUrl: film.trailer_url ?? null,
        }}
      />
      <Toast />
    </div>
  );
}

function Pill({ children, emphasis }) {
  return emphasis ? (
    <span className="flex items-center gap-1.5 rounded-full border px-[13px] py-1.5 text-[13px] font-semibold text-[var(--text)]" style={{ backgroundColor: "rgba(58,110,165,.18)", borderColor: "rgba(94,148,206,.35)" }}>
      {children}
    </span>
  ) : (
    <span className="rounded-full border px-[13px] py-1.5 text-[13px] text-[var(--muted)]" style={{ borderColor: "var(--border)" }}>
      {children}
    </span>
  );
}

function buildFacts(film) {
  const facts = [];
  if (film.category?.name) facts.push({ label: "Genre", value: film.category.name });
  if (film.duration_min) facts.push({ label: "Durée", value: formatDuration(film.duration_min) });
  if (film.release_date) {
    facts.push({
      label: "Sortie",
      value: new Date(film.release_date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    });
  }
  if (film.director) facts.push({ label: "Réalisation", value: film.director });
  return facts;
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m.toString().padStart(2, "0")}` : `${h}h`;
}