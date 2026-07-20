import { useEffect } from "react";
import { Play, X, ExternalLink } from "lucide-react";

/**
 * Converts a public YouTube/Vimeo URL to an embeddable URL.
 * Returns null if the URL isn't recognised (shows the placeholder instead).
 */
function toEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);

    // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID or youtube.com/shorts/ID
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const segments = u.pathname.split("/").filter(Boolean);
      const id =
        u.searchParams.get("v") ||
        (u.hostname === "youtu.be" ? segments[0] : null) ||
        (segments[0] === "embed" ? segments[1] : null) ||
        (segments[0] === "shorts" ? segments[1] : null);
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }

    // Vimeo: vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
  } catch {
    // malformed URL — fall through to placeholder
  }
  return null;
}

export default function TrailerModal({ open, onClose, film }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const embedUrl = toEmbedUrl(film?.trailerUrl);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(2,4,14,0.82)] p-4 backdrop-blur-[10px] animate-in fade-in duration-300 sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[880px] overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] shadow-[0_40px_120px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-4 duration-500"
      >
        {/* Player */}
        <div className="relative aspect-video w-full">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={`${film?.title} — Bande-annonce`}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            /* Placeholder shown when no trailer URL is set */
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(120%_100%_at_50%_30%,#17286D,#000)]">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, rgba(168,192,224,.05) 0 2px, transparent 2px 26px)",
                }}
              />
              <span className="relative flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[rgba(249,249,249,0.92)] text-[#0A0F2C] shadow-[0_0_50px_rgba(94,148,206,0.5)]">
                <Play className="h-[30px] w-[30px]" fill="currentColor" />
              </span>
              <span className="absolute bottom-[18px] left-5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-[rgba(221,230,240,0.4)]">
                Bande-annonce non disponible
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-7">
          <div className="min-w-0">
            <h3 className="truncate font-['Sora'] text-xl font-semibold text-[var(--text)]">
              {film?.title} — Bande-annonce
            </h3>
            <p className="mt-1.5 text-[13.5px] text-[var(--faint)]">
              {[film?.genre, film?.runtime, film?.year].filter(Boolean).join(" · ")}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {film?.trailerUrl && (
              <a
                href={film.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ouvrir dans YouTube"
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:bg-[var(--surface2)]"
              >
                <ExternalLink className="h-[16px] w-[16px]" />
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition-colors hover:bg-[var(--surface2)]"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}