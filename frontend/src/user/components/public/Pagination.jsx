import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({ page, lastPage, total, onPageChange }) {
  if (!lastPage || lastPage <= 1) return null;

  return (
    <div className="mt-2 flex items-center justify-between gap-4 border-t px-1 pt-4" style={{ borderColor: "var(--border)" }}>
      <span className="text-xs" style={{ color: "var(--muted)" }}>
        Page {page} sur {lastPage}
        {typeof total === "number" ? ` · ${total} au total` : ""}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Page précédente"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{ color: "var(--text)", backgroundColor: "var(--surface2)", border: "none", cursor: "pointer" }}
        >
          <ChevronLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= lastPage}
          aria-label="Page suivante"
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{ color: "var(--text)", backgroundColor: "var(--surface2)", border: "none", cursor: "pointer" }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
