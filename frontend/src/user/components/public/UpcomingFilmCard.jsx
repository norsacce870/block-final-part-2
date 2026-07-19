import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { STORAGE_URL } from "@/utils/storageUrl";

/**
 * Expected film shape:
 * { id_film, title, poster, synopsis, release_date }
 */
export default function UpcomingFilmCard({ film, onNotify }) {
  const posterUrl = film.poster ? `${STORAGE_URL}${film.poster}` : null;

  return (
    <Link
      to={`/films/${film.id_film}`}
      className="group block w-[262px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow,transform] duration-[450ms] [transition-timing-function:cubic-bezier(.16,.84,.3,1)] hover:-translate-y-2 hover:border-[#5E94CE]/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col justify-end p-[22px] transition-transform duration-700 [transition-timing-function:cubic-bezier(.16,.84,.3,1)] group-hover:scale-[1.07]"
          style={{
            backgroundImage: posterUrl
              ? `url(${posterUrl})`
              : "repeating-linear-gradient(125deg, rgba(168,192,224,.07) 0 2px, transparent 2px 22px), linear-gradient(160deg, #2D3E50, #0A0F2C 75%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!posterUrl && (
            <span className="mb-auto font-mono text-[9.5px] uppercase tracking-[0.14em] text-[rgba(221,230,240,0.32)]">
              affiche
            </span>
          )}
          <h3 className="font-['Sora'] text-[25px] font-bold leading-[1.05] tracking-[-0.01em] text-white text-balance">
            {film.title}
          </h3>
        </div>

        <span className="absolute left-3.5 top-3.5 rounded-full border border-[#5E94CE]/40 bg-[rgba(58,110,165,0.22)] px-[11px] py-[5px] text-[11px] font-semibold uppercase tracking-[0.06em] text-[#DDE6F0] backdrop-blur-[6px]">
          Bientôt
        </span>

        {/* Hover reveal: synopsis + notify CTA */}
        <div className="absolute inset-0 flex translate-y-3.5 flex-col justify-end gap-3.5 bg-gradient-to-t from-[rgba(4,7,22,0.96)] via-[rgba(4,7,22,0.75)] via-45% to-[rgba(4,7,22,0.2)] p-[22px] opacity-0 transition-[opacity,transform] duration-[450ms] group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[13.5px] font-light leading-[1.55] text-[#C9D6E8] line-clamp-3">
            {film.synopsis}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNotify?.(film);
            }}
            className="flex w-full items-center justify-center gap-[9px] rounded-[11px] border border-[#5E94CE]/40 bg-transparent py-[13px] font-['Sora'] text-sm font-semibold text-white transition-colors hover:border-[#5E94CE]/70 hover:bg-[rgba(58,110,165,0.2)]"
          >
            <Bell className="h-[15px] w-[15px]" />
            M'avertir
          </button>
        </div>
      </div>

      <div className="px-[18px] py-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent2)]">
          Sortie
        </p>
        <p className="mt-1.5 text-[14.5px] font-semibold text-[var(--text)]">
          {formatReleaseDate(film.release_date)}
        </p>
      </div>
    </Link>
  );
}

function formatReleaseDate(dateString) {
  if (!dateString) return "Bientôt disponible";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
