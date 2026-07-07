import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus, CalendarClock } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import PageHeader from '../../../components/PageHeader'
import api from '../../../api/axios'

function ScreeningsList() {
    const [screenings, setScreenings] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const res = await api.get('/screenings')
            setScreenings(res.data)
            setLoading(false)
        }
        load()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette séance ?')) return
        await api.delete(`/screenings/${id}`)
        setScreenings(screenings.filter(s => s.id_screening !== id))
    }

    const seatStatus = (n) => {
        if (n > 10) return { label: `${n} places`, color: 'var(--admin-success)', bg: 'var(--admin-success-soft)' }
        if (n > 0) return { label: `${n} places`, color: 'var(--admin-warning)', bg: 'var(--admin-warning-soft)' }
        return { label: 'Complet', color: 'var(--admin-danger)', bg: 'var(--admin-danger-soft)' }
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-5xl">
                <PageHeader
                    icon={CalendarClock}
                    title="Séances"
                    subtitle="Toutes les projections programmées."
                    action={
                        <Link
                            to="/admin/screenings/create"
                            className="admin-primary-btn flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold text-white"
                            style={{ backgroundColor: 'var(--admin-accent)' }}
                        >
                            <Plus size={16} />
                            Ajouter une séance
                        </Link>
                    }
                />

                <div className="admin-card mt-7 overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                    <div className="min-w-[760px]">
                        <div
                            className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr_auto] gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                color: 'var(--admin-muted)',
                            }}
                        >
                            <span>Film</span>
                            <span>Salle</span>
                            <span>Date</span>
                            <span>Heure</span>
                            <span>Places restantes</span>
                            <span>Actions</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                Chargement…
                            </div>
                        ) : screenings.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center" style={{ color: 'var(--admin-muted)' }}>
                                <CalendarClock size={22} style={{ opacity: 0.5 }} />
                                <p className="text-sm">Aucune séance programmée pour l'instant.</p>
                            </div>
                        ) : (
                            screenings.map((s) => {
                                const status = seatStatus(s.seats_remaining)
                                return (
                                    <div
                                        key={s.id_screening}
                                        className="admin-row grid grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr_auto] items-center gap-4 px-5 py-3.5"
                                        style={{ '--admin-row-accent': status.color }}
                                    >
                                        <span className="text-[15px] font-medium" style={{ color: 'var(--admin-text)' }}>
                                            {s.film?.title || '—'}
                                        </span>
                                        <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {s.room?.name || '—'}
                                        </span>
                                        <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {s.date}
                                        </span>
                                        <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {s.time}
                                        </span>
                                        <span>
                                            <span
                                                className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                {status.label}
                                            </span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/screenings/${s.id_screening}/edit`}
                                                aria-label="Modifier"
                                                className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)' }}
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(s.id_screening)}
                                                aria-label="Supprimer"
                                                className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                style={{ color: 'var(--admin-danger)', backgroundColor: 'var(--admin-danger-soft)', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default ScreeningsList