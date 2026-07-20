import { ChevronLeft, ChevronRight } from 'lucide-react'

function AdminPagination({ page, lastPage, total, onPageChange }) {
    if (!lastPage || lastPage <= 1) return null

    return (
        <div
            className="flex items-center justify-between gap-4 border-t px-5 py-3.5"
            style={{ borderColor: 'var(--admin-border)' }}
        >
            <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                Page {page} sur {lastPage}
                {typeof total === 'number' ? ` · ${total} au total` : ''}
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Page précédente"
                    className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronLeft size={14} />
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= lastPage}
                    aria-label="Page suivante"
                    className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)', border: 'none', cursor: 'pointer' }}
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    )
}

export default AdminPagination
