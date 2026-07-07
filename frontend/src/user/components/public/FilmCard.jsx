import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";

const STORAGE_URL = "http://127.0.0.1:8000/storage/";

/**
 * Expected film shape (adjust to match your API serialization):
 * {
 *   id_film, title, poster, rating, duration_min, synopsis,
 *   category: { name },
 *   room: { name } // e.g. screening.room.name
 * }
 */
export default function FilmCard({ film, onReserve }) {
  const posterUrl = film.poster ? `${STORAGE_URL}${film.poster}` : null;

  return (
    <Link
      to={`/films/${film.id_film}`}
      className="group block w-[262px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow,transform] duration-[450ms] [transition-timing-function:cubic-bezier(.16,.84,.3,1)] hover:-translate-y-2 hover:border-[#5E94CE]/50 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
      <div className="relative aspect-[2/3] overflow-hidden">
        <div
          className="absolute inset-0 flex flex-col justify-end p-[22px] transition-transform duration-700 [transition-timing-function:cubic-bezier(.16,.84,.3,1)] group-hover:scale-[1.07]"
          style={{
            backgroundImage: posterUrl
              ? `url(${posterUrl})`
              : "repeating-linear-gradient(125deg, rgba(168,192,224,.07) 0 2px, transparent 2px 22px), linear-gradient(160deg, #17286D, #0A0F2C 70%)",
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

        {film.rating != null && (
          <span className="absolute right-3.5 top-3.5 flex items-center gap-1.5 rounded-full border border-[#5E94CE]/30 bg-black/50 px-[11px] py-[5px] text-[12.5px] font-semibold text-white backdrop-blur-[6px]">
            <Star className="h-3 w-3 fill-[#5E94CE] text-[#5E94CE]" />
            {film.rating}
          </span>
        )}

        {/* Hover reveal: synopsis + reserve CTA */}
        <div className="absolute inset-0 flex translate-y-3.5 flex-col justify-end gap-3.5 bg-gradient-to-t from-[rgba(4,7,22,0.96)] via-[rgba(4,7,22,0.75)] via-45% to-[rgba(4,7,22,0.2)] p-[22px] opacity-0 transition-[opacity,transform] duration-[450ms] group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-[13.5px] font-light leading-[1.55] text-[#C9D6E8] line-clamp-3">
            {film.synopsis}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReserve?.(film);
            }}
            className="w-full rounded-[11px] bg-[var(--accent)] py-[13px] font-['Sora'] text-sm font-semibold text-white transition-colors hover:bg-[var(--accent2)]"
          >
            Réserver
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2.5 px-[18px] py-4">
        <div>
          <p className="text-[13.5px] font-semibold text-[var(--text)]">
            {film.category?.name}
          </p>
          <p className="mt-0.5 text-xs text-[var(--faint)]">
            {formatDuration(film.duration_min)}
            {film.room?.name ? ` · Salle ${film.room.name}` : ""}
          </p>
        </div>
        <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--accent2)]">
          <ArrowRight className="h-[15px] w-[15px]" />
        </span>
      </div>
    </Link>
  );
}

function formatDuration(minutes) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m.toString().padStart(2, "0")}` : `${h}h`;
}
