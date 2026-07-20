import { useEffect, useMemo, useState } from "react";
import { Star, Play, ArrowRight, Search } from "lucide-react";
import api from "@/api/axios";
import { ThemeProvider } from "@/user/context/ThemeProvider";
import { ToastProvider, useToast } from "@/user/context/ToastProvider";
import Navbar from "@/user/components/public/Navbar";
import Footer from "@/user/components/public/Footer";
import FilmCard from "@/user/components/public/FilmCard";
import UpcomingFilmCard from "@/user/components/public/UpcomingFilmCard";
import PricingCard from "@/user/components/public/PricingCard";
import CategoryFilter from "@/user/components/public/CategoryFilter";
import TrailerModal from "@/user/components/public/TrailerModal";
import Toast from "@/user/components/public/Toast";
import { getPosterUrl } from "@/utils/storageUrl";
import {
  DEMO_NOW_SHOWING,
  DEMO_UPCOMING,
  FEATURED_FILM,
  CATEGORY_NAMES,
  EXPERIENCE_FEATURES,
  PRICING_TIERS,
} from "@/user/data/homeContent";

export default function Accueil() {
  // ThemeProvider/ToastProvider are scoped to this page for now. Once the
  // rest of the public site (Films, Séances, Tarifs, À propos) exists, move
  // these up to App.jsx (or a PublicLayout) so the theme choice persists
  // across pages instead of resetting to "dark" on navigation.
  return (
    <ThemeProvider>
      <ToastProvider>
        <AccueilContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

function AccueilContent() {
  const { showToast } = useToast();
  const [featured, setFeatured] = useState(FEATURED_FILM);
  const [nowShowing, setNowShowing] = useState([FEATURED_FILM, ...DEMO_NOW_SHOWING]);
  const [upcoming, setUpcoming] = useState(DEMO_UPCOMING);
  const [categories, setCategories] = useState(CATEGORY_NAMES);
  const [activeCat, setActiveCat] = useState("Tous");
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    // Demo data above renders immediately so the page never looks empty;
    // it's replaced as soon as the real API response comes back. If the
    // request fails (e.g. backend not running yet), we just keep the demo
    // data.
    //
    // One single GET /films call, split client-side by film.status — this
    // doesn't depend on the backend actually filtering by a `status` query
    // param, it just reads the field that's already on each film (the same
    // one driving the "À l'affiche" / "À venir" badge in the admin Films
    // list). If your status values aren't exactly "showing" / "coming_soon",
    // update the two checks below to match.
    api
      .get("/films")
      .then((res) => {
        const films = res.data?.data ?? res.data ?? [];
        if (!films.length) return;

        const showing = films
          .filter((f) => f.status === "showing")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const comingSoon = films.filter((f) => f.status === "coming_soon");

        if (showing.length) {
          // No dedicated "featured" flag exists on the film model yet, so
          // the hero spotlights the most recently created showing film —
          // and it stays in the grid below too, rather than vanishing from
          // "À l'affiche".
          setFeatured(showing[0]);
          setNowShowing(showing);
        }
        if (comingSoon.length) setUpcoming(comingSoon);
      })
      .catch(() => {});

    api
      .get("/categories")
      .then((res) => {
        const cats = res.data?.data ?? res.data ?? [];
        if (cats.length) setCategories(["Tous", ...cats.map((c) => c.name)]);
      })
      .catch(() => {});
  }, []);

  const filteredNowShowing = useMemo(() => {
    if (activeCat === "Tous") return nowShowing;
    return nowShowing.filter((f) => f.category?.name === activeCat);
  }, [nowShowing, activeCat]);

  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-hidden font-sans"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <Navbar />

      <Hero
        film={featured}
        onWatchTrailer={() => setTrailerOpen(true)}
        onReserve={() =>
          showToast(`Réservation ouverte — ${featured.title}`)
        }
      />

      {/* Search + genre filter */}
      <section className="relative z-10 mx-auto max-w-[1320px] px-4 pt-[18px] sm:px-8">
        <div
          className="-mt-11 rounded-[22px] border p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-[8px] sm:p-[26px]"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
        >
          <div
            className="flex items-center gap-2 rounded-2xl border py-1.5 pl-3 sm:gap-3.5 sm:pl-5"
            style={{ backgroundColor: "var(--surface2)", borderColor: "var(--border)" }}
          >
            <Search className="h-5 w-5 shrink-0" style={{ color: "var(--muted)" }} />
            <input
              placeholder="Rechercher un film, un genre, un réalisateur…"
              aria-label="Rechercher un film, un genre, un réalisateur"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm placeholder:opacity-60 focus:outline-none sm:text-base"
              style={{ color: "var(--text)" }}
            />
            <button
              type="button"
              className="shrink-0 rounded-[10px] px-4 py-2.5 font-['Sora'] text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent2)] sm:px-[26px] sm:py-[13px] sm:text-[14.5px]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Rechercher
            </button>
          </div>

          <div className="mt-[18px]">
            <CategoryFilter
              categories={categories}
              active={activeCat}
              onSelect={setActiveCat}
            />
          </div>
        </div>
      </section>

      {/* Now showing */}
      <section id="films" className="mx-auto max-w-[1320px] px-4 pt-[78px] sm:px-8">
        <div className="mb-[34px] flex items-end justify-between gap-5">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent2)]">
              Séances en cours
            </span>
            <h2 className="mt-3 font-['Sora'] text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
              À l'affiche
            </h2>
          </div>
          <a
            href="#films"
            className="navlink flex items-center gap-[7px] whitespace-nowrap text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
          >
            Tout voir <ArrowRight className="h-[15px] w-[15px]" />
          </a>
        </div>

        {filteredNowShowing.length === 0 ? (
          <EmptyRow message="Aucun film ne correspond à ce genre pour le moment." />
        ) : (
          <div className="rail flex gap-6 overflow-x-auto px-1 pb-6 [scroll-snap-type:x_mandatory]">
            {filteredNowShowing.map((film) => (
              <FilmCard
                key={film.id_film}
                film={film}
                onReserve={(f) =>
                  showToast(`Réservation ouverte — ${f.title}`)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming */}
      <section className="mx-auto max-w-[1320px] px-4 pt-16 sm:px-8">
        <div className="mb-[34px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent2)]">
            Bientôt sous le baobab
          </span>
          <h2 className="mt-3 font-['Sora'] text-[clamp(30px,4vw,44px)] font-bold tracking-[-0.02em]">
            Prochainement
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <EmptyRow message="Rien d'annoncé pour l'instant — revenez bientôt." />
        ) : (
          <div className="rail flex gap-6 overflow-x-auto px-1 pb-6 [scroll-snap-type:x_mandatory]">
            {upcoming.map((film) => (
              <UpcomingFilmCard
                key={film.id_film}
                film={film}
                onNotify={(f) =>
                  showToast(`Vous serez averti de la sortie de ${f.title}`)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="relative mt-24 overflow-hidden py-24"
        style={{ backgroundColor: "var(--bg2)" }}
      >
        <div
          className="pointer-events-none absolute -top-[10%] left-1/2 h-[500px] w-[900px] -translate-x-1/2 blur-[20px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(58,110,165,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1320px] px-4 sm:px-8">
          <div className="mx-auto mb-16 max-w-[680px] text-center">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent2)]">
              L'expérience Baobab
            </span>
            <h2 className="mt-3.5 mb-[18px] font-['Sora'] text-[clamp(32px,4.4vw,50px)] font-bold tracking-[-0.02em] text-balance">
              Le cinéma comme un lieu de retrouvailles
            </h2>
            <p className="text-[17px] font-light leading-[1.7]" style={{ color: "var(--muted)" }}>
              Comme à l'ombre du baobab, on se rassemble pour partager une
              émotion. Tout est pensé pour que la séance reste un souvenir.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
            {EXPERIENCE_FEATURES.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-[18px] border px-7 py-8 transition-[transform,border-color] duration-[400ms] hover:-translate-y-1.5"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span
                  className="mb-[22px] flex h-[54px] w-[54px] items-center justify-center rounded-2xl border text-[var(--accent2)]"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(58,110,165,.28), rgba(23,40,109,.4))",
                    borderColor: "rgba(94,148,206,.3)",
                  }}
                >
                  <Icon className="h-[26px] w-[26px]" strokeWidth={1.7} />
                </span>
                <h3 className="mb-2.5 font-['Sora'] text-[19px] font-semibold">
                  {title}
                </h3>
                <p className="text-[14.5px] leading-[1.6]" style={{ color: "var(--faint)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="mx-auto max-w-[1320px] px-4 pt-24 sm:px-8">
        <div className="mx-auto mb-14 max-w-[620px] text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent2)]">
            Tarifs
          </span>
          <h2 className="mt-3.5 font-['Sora'] text-[clamp(32px,4.4vw,50px)] font-bold tracking-[-0.02em]">
            Choisissez votre fauteuil
          </h2>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch gap-6">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              onSelect={(t) => showToast(`Tarif ${t.name} sélectionné`)}
            />
          ))}
        </div>
      </section>

      <Newsletter onSubscribe={showToast} />

      <Footer />

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        film={{
          title: featured.title,
          genre: featured.category?.name,
          runtime: formatDuration(featured.duration_min),
          year: featured.release_date ? new Date(featured.release_date).getFullYear() : "",
          trailerUrl: featured.trailer_url ?? null,
        }}
      />
      <Toast />
    </div>
  );
}

function Hero({ film, onWatchTrailer, onReserve }) {
  const posterUrl = getPosterUrl(film.poster);

  return (
    <header className="relative flex min-h-screen items-end overflow-hidden">
      {/* Poster en fond flouté */}
      {posterUrl && (
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(1px) brightness(0.85) saturate(1.2)", transform: "scale(1.04)" }}
        />
      )}

      {/* Dégradé de base */}
      <div
        className="absolute inset-0"
        style={{
          background: posterUrl
            ? "linear-gradient(180deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,.1) 35%, rgba(0,0,0,.3) 65%, var(--bg) 100%)"
            : "radial-gradient(120% 90% at 70% 20%, #17286D 0%, #0A0F2C 45%, #000 100%)",
        }}
      />

      {/* Motif de lignes — uniquement sans poster */}
      {!posterUrl && (
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(115deg, rgba(168,192,224,.05) 0 2px, transparent 2px 26px)",
          }}
        />
      )}

      {/* Halos ambiants — uniquement sans poster */}
      {!posterUrl && (
        <>
          <div
            className="pointer-events-none absolute -top-[12%] left-[62%] h-[780px] w-[780px] animate-pulse rounded-full blur-[20px]"
            style={{
              background:
                "radial-gradient(circle, rgba(58,110,165,.55) 0%, rgba(23,40,109,.22) 40%, transparent 70%)",
              animationDuration: "9s",
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-[20%] -left-[8%] h-[620px] w-[620px] animate-pulse rounded-full blur-[30px]"
            style={{
              background:
                "radial-gradient(circle, rgba(94,148,206,.3) 0%, transparent 65%)",
              animationDuration: "11s",
            }}
          />
        </>
      )}

      {/* Dégradé latéral gauche — met le texte en valeur */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,.78) 0%, rgba(0,0,0,.35) 45%, transparent 75%)",
        }}
      />
      {/* Fondu bas */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,.55) 0%, transparent 30%, rgba(0,0,0,.35) 60%, var(--bg) 100%)",
        }}
      />

      <div className="relative z-[5] mx-auto w-full max-w-[1320px] px-4 pb-[88px] sm:px-8">
        <div className="max-w-[640px]">
          <div className="mb-[22px] flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#5E94CE]">
              À l'affiche cette semaine
            </span>
            <span className="h-px w-[34px] bg-[#5E94CE] opacity-50" />
          </div>

          <h1 className="mb-6 font-['Sora'] text-[clamp(48px,7vw,92px)] font-bold leading-[0.98] tracking-[-0.02em] text-[#F9F9F9]">
            {splitTitleLines(film.title).map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            {film.rating && (
              <span className="flex items-center gap-1.5 rounded-full border border-[#5E94CE]/35 bg-[rgba(58,110,165,0.18)] px-[13px] py-1.5 text-[13px] font-semibold text-[#DDE6F0]">
                <Star className="h-3.5 w-3.5 fill-[#5E94CE] text-[#5E94CE]" />
                {film.rating}
              </span>
            )}
            {film.category?.name && (
              <Pill>{film.category.name}</Pill>
            )}
            {film.duration_min && (
              <Pill>{formatDuration(film.duration_min)}</Pill>
            )}
            {(film.language || film.year) && (
              <Pill>
                {film.language} · {film.year}
              </Pill>
            )}
          </div>

          <p className="mb-9 line-clamp-3 max-w-[540px] text-[17px] font-light leading-[1.65] text-[#C9D6E8]">
            {film.synopsis}
          </p>

          <div className="flex flex-wrap gap-3.5">
            <button
              type="button"
              onClick={onWatchTrailer}
              className="flex items-center gap-[11px] rounded-full bg-[#F9F9F9] px-[30px] py-4 font-['Sora'] text-[15.5px] font-semibold text-[#0A0F2C] transition-all hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(249,249,249,0.2)]"
            >
              <Play className="h-4 w-4" fill="currentColor" />
              Bande-annonce
            </button>
            <button
              type="button"
              onClick={onReserve}
              className="flex items-center gap-[11px] rounded-full bg-[var(--accent)] px-[30px] py-4 font-['Sora'] text-[15.5px] font-semibold text-white shadow-[0_12px_36px_rgba(58,110,165,0.45)] transition-all hover:-translate-y-1 hover:bg-[var(--accent2)] hover:shadow-[0_18px_48px_rgba(58,110,165,0.6)]"
            >
              Réserver maintenant
              <ArrowRight className="h-[17px] w-[17px]" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[26px] left-1/2 z-[5] flex -translate-x-1/2 flex-col items-center gap-2 text-[rgba(221,230,240,0.5)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          Défiler
        </span>
        <span className="h-[34px] w-px bg-gradient-to-b from-[#5E94CE] to-transparent" />
      </div>
    </header>
  );
}

function Newsletter({ onSubscribe }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      onSubscribe("Saisissez votre adresse e-mail");
      return;
    }
    // TODO: wire to your actual newsletter endpoint, e.g. api.post("/newsletter", { email })
    onSubscribe("Merci ! Vous êtes abonné.");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-[1320px] px-4 pb-6 pt-24 sm:px-8">
      <div
        className="relative overflow-hidden rounded-[26px] border px-5 py-10 text-center sm:px-11 sm:py-16"
        style={{
          background: "linear-gradient(135deg, #17286D, #0A0F2C 70%)",
          borderColor: "rgba(94,148,206,.25)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-[5%] -top-[40%] h-[480px] w-[480px] rounded-full blur-[20px]"
          style={{
            background:
              "radial-gradient(circle, rgba(58,110,165,.4), transparent 65%)",
          }}
        />
        <div className="relative">
          <h2 className="mb-3.5 font-['Sora'] text-[clamp(28px,3.6vw,40px)] font-bold tracking-[-0.02em] text-[#F9F9F9] text-balance">
            Ne manquez jamais une première
          </h2>
          <p className="mx-auto mb-8 max-w-[480px] text-base font-light leading-[1.6] text-[#C9D6E8]">
            Les sorties, les avant-premières et les soirées spéciales —
            directement dans votre boîte mail.
          </p>
          <div className="mx-auto flex max-w-[520px] flex-wrap justify-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              aria-label="Adresse e-mail pour la newsletter"
              className="min-w-[240px] flex-1 rounded-xl border border-[rgba(168,192,224,0.25)] bg-[rgba(0,0,0,0.3)] px-5 py-4 text-[15px] text-[#F9F9F9] outline-none transition-colors focus:border-[#5E94CE]/70"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="shrink-0 rounded-xl bg-[#F9F9F9] px-[30px] py-4 font-['Sora'] text-[15px] font-semibold text-[#0A0F2C] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(249,249,249,0.22)]"
            >
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="rounded-full border border-[rgba(168,192,224,0.22)] px-[13px] py-1.5 text-[13px] text-[#DDE6F0]">
      {children}
    </span>
  );
}

function EmptyRow({ message }) {
  return (
    <div
      className="rounded-2xl border px-6 py-10 text-center text-sm"
      style={{ borderColor: "var(--border)", color: "var(--faint)" }}
    >
      {message}
    </div>
  );
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m.toString().padStart(2, "0")}` : `${h}h`;
}

// Splits a title into two display lines, last word on its own line — matches
// the "Horizon / Bleu" treatment from the design. Falls back to a single
// line for one-word titles so nothing gets duplicated.
function splitTitleLines(title) {
  const words = title.trim().split(" ");
  if (words.length <= 1) return [title];
  return [words.slice(0, -1).join(" "), words.slice(-1).join(" ")];
}