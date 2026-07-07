import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function PageHeader({ icon: Icon, title, subtitle, action, backTo }) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
                {backTo && (
                    <Link
                        to={backTo}
                        aria-label="Retour"
                        className="admin-icon-btn flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                    >
                        <ArrowLeft size={18} />
                    </Link>
                )}
                <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                    style={{
                        backgroundColor: 'var(--admin-accent-soft)',
                        borderColor: 'var(--admin-accent)',
                        color: 'var(--admin-accent)',
                    }}
                >
                    <Icon size={22} />
                </span>
                <div>
                    <h1
                        className="text-3xl"
                        style={{ fontFamily: 'var(--font-title)', color: 'var(--admin-text)' }}
                    >
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-1 text-sm" style={{ color: 'var(--admin-muted)' }}>
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {action}
        </div>
    )
}

export default PageHeader