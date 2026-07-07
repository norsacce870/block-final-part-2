import { useState, useEffect } from 'react'
import { Check, X, Trash2, Ticket } from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import PageHeader from '../../components/PageHeader'
import api from '../../api/axios'

function BookingsList() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBookings = async () => {
        const res = await api.get('/bookings')
        setBookings(res.data)
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await fetchBookings()
            setLoading(false)
        }
        load()
    }, [])

    const handleStatus = async (id, status) => {
        await api.put(`/bookings/${id}`, { status })
        fetchBookings()
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette réservation ?')) return
        await api.delete(`/bookings/${id}`)
        fetchBookings()
    }

    const statusInfo = {
        pending:   { label: 'En attente', color: 'var(--admin-warning)', bg: 'var(--admin-warning-soft)' },
        confirmed: { label: 'Confirmée',  color: 'var(--admin-success)', bg: 'var(--admin-success-soft)' },
        expired:   { label: 'Expirée',    color: 'var(--admin-muted)',   bg: 'var(--admin-surface2)' },
        cancelled: { label: 'Annulée',    color: 'var(--admin-danger)',  bg: 'var(--admin-danger-soft)' },
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-6xl">
                <PageHeader
                    icon={Ticket}
                    title="Réservations"
                    subtitle="Toutes les réservations passées par les clients."
                />

                <div className="admin-card mt-7 overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                    <div className="min-w-[920px]">
                        <div
                            className="grid grid-cols-[1.3fr_1.1fr_1.3fr_0.6fr_0.9fr_0.9fr_auto] gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                color: 'var(--admin-muted)',
                                borderLeft: '3px solid transparent', // matches admin-row's 3px left border
                            }}
                        >
                            <span>Client</span>
                            <span>Film</span>
                            <span>Séance</span>
                            <span>Places</span>
                            <span>Statut</span>
                            <span>Expire le</span>
                            <span>Actions</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                Chargement…
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center" style={{ color: 'var(--admin-muted)' }}>
                                <Ticket size={22} style={{ opacity: 0.5 }} />
                                <p className="text-sm">Aucune réservation pour l'instant.</p>
                            </div>
                        ) : (
                            bookings.map((b) => {
                                const status = statusInfo[b.status] ?? statusInfo.expired
                                return (
                                    <div
                                        key={b.id_booking}
                                        className="admin-row grid grid-cols-[1.3fr_1.1fr_1.3fr_0.6fr_0.9fr_0.9fr_auto] items-center gap-4 px-5 py-3.5"
                                        style={{ '--admin-row-accent': status.color }}
                                    >
                                        <div>
                                            <div className="text-[15px] font-medium" style={{ color: 'var(--admin-text)' }}>
                                                {b.user?.first_name} {b.user?.last_name}
                                            </div>
                                            <div className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                                                {b.user?.email}
                                            </div>
                                        </div>

                                        <span className="text-sm" style={{ color: 'var(--admin-text)' }}>
                                            {b.screening?.film?.title || '—'}
                                        </span>

                                        <div>
                                            <div className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                                {b.screening?.date} à {b.screening?.time}
                                            </div>
                                            <div className="text-xs" style={{ color: 'var(--admin-muted)', opacity: 0.75 }}>
                                                {b.screening?.room?.name}
                                            </div>
                                        </div>

                                        <span className="text-sm" style={{ color: 'var(--admin-text)' }}>
                                            {b.seats_count}
                                        </span>

                                        <span>
                                            <span
                                                className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                {status.label}
                                            </span>
                                        </span>

                                        <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                                            {b.expires_at ? new Date(b.expires_at).toLocaleString('fr-FR') : '—'}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            {b.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatus(b.id_booking, 'confirmed')}
                                                        aria-label="Confirmer"
                                                        title="Confirmer"
                                                        className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                        style={{ color: 'var(--admin-success)', backgroundColor: 'var(--admin-success-soft)', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        <Check size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatus(b.id_booking, 'cancelled')}
                                                        aria-label="Annuler"
                                                        title="Annuler"
                                                        className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                        style={{ color: 'var(--admin-warning)', backgroundColor: 'var(--admin-warning-soft)', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(b.id_booking)}
                                                aria-label="Supprimer"
                                                title="Supprimer"
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

export default BookingsList