import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Film, CalendarClock, Ticket, Users,
    Clock, CheckCircle, AlertCircle,
    ArrowRight, Plus, LayoutDashboard,
} from 'lucide-react'
import AdminLayout from '../../components/AdminLayout'
import api from '../../api/axios'

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(str) {
    if (!str) return '—'
    return new Date(str).toLocaleDateString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
    })
}

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, accent }) {
    return (
        <div
            className="admin-card flex flex-col gap-4 rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
            <div className="flex items-center justify-between">
                <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl border"
                    style={{
                        backgroundColor: accent ? `${accent}22` : 'var(--admin-accent-soft)',
                        borderColor: accent ? `${accent}55` : 'var(--admin-accent)',
                        color: accent || 'var(--admin-accent)',
                    }}
                >
                    <Icon size={20} strokeWidth={1.8} />
                </span>
            </div>
            <div>
                <p className="font-['Archivo_Black'] text-[2rem] leading-none" style={{ color: 'var(--admin-text)' }}>
                    {value ?? <Skeleton />}
                </p>
                <p className="mt-1.5 text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
                    {label}
                </p>
                {sub && (
                    <p className="mt-1 text-xs" style={{ color: 'var(--admin-muted)' }}>
                        {sub}
                    </p>
                )}
            </div>
        </div>
    )
}

// ─── quick action ─────────────────────────────────────────────────────────────

function QuickAction({ icon: Icon, label, to, accent }) {
    return (
        <Link
            to={to}
            className="admin-icon-btn flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors"
            style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
        >
            <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                    backgroundColor: accent ? `${accent}22` : 'var(--admin-accent-soft)',
                    color: accent || 'var(--admin-accent)',
                }}
            >
                <Icon size={17} />
            </span>
            <span className="flex-1 text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
                {label}
            </span>
            <ArrowRight size={15} style={{ color: 'var(--admin-muted)' }} />
        </Link>
    )
}

// ─── booking status info ──────────────────────────────────────────────────────

const STATUS_INFO = {
    pending:   { label: 'En attente', color: 'var(--admin-warning)', bg: 'var(--admin-warning-soft)', icon: Clock },
    confirmed: { label: 'Confirmée',  color: 'var(--admin-success)', bg: 'var(--admin-success-soft)', icon: CheckCircle },
    expired:   { label: 'Expirée',    color: 'var(--admin-muted)',   bg: 'var(--admin-surface2)',     icon: AlertCircle },
    cancelled: { label: 'Annulée',    color: 'var(--admin-danger)',  bg: 'var(--admin-danger-soft)',  icon: AlertCircle },
}

// ─── skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <span
            className="inline-block h-8 w-12 animate-pulse rounded-lg"
            style={{ backgroundColor: 'var(--admin-surface2)' }}
        />
    )
}

// ─── dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
    const [films, setFilms] = useState(null)
    const [screenings, setScreenings] = useState(null)
    const [bookings, setBookings] = useState(null)

    useEffect(() => {
        api.get('/films').then(r => setFilms(r.data)).catch(() => setFilms([]))
        api.get('/screenings').then(r => setScreenings(r.data)).catch(() => setScreenings([]))
        api.get('/bookings').then(r => setBookings(r.data)).catch(() => setBookings([]))
    }, [])

    // derived stats
    const showing = films?.filter(f => f.status === 'showing').length
    const comingSoon = films?.filter(f => f.status === 'coming_soon').length
    const totalBookings = bookings?.length
    const pending = bookings?.filter(b => b.status === 'pending').length
    const confirmed = bookings?.filter(b => b.status === 'confirmed').length
    const recentBookings = bookings
        ? [...bookings]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(0, 6)
        : null

    return (
        <AdminLayout>
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex items-center gap-3.5">
                    <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                            backgroundColor: 'var(--admin-accent-soft)',
                            borderColor: 'var(--admin-accent)',
                            color: 'var(--admin-accent)',
                        }}
                    >
                        <LayoutDashboard size={22} />
                    </span>
                    <div>
                        <h1 className="text-3xl" style={{ fontFamily: 'var(--font-title)', color: 'var(--admin-text)' }}>
                            Tableau de bord
                        </h1>
                        <p className="mt-1 text-sm" style={{ color: 'var(--admin-muted)' }}>
                            Vue d'ensemble de Baobab Cinéma.
                        </p>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={Film}
                        label="Films à l'affiche"
                        value={showing}
                        sub={comingSoon != null ? `${comingSoon} à venir` : undefined}
                    />
                    <StatCard
                        icon={CalendarClock}
                        label="Séances programmées"
                        value={screenings?.length}
                    />
                    <StatCard
                        icon={Ticket}
                        label="Réservations totales"
                        value={totalBookings}
                        sub={pending != null ? `${pending} en attente` : undefined}
                        accent="#E0A458"
                    />
                    <StatCard
                        icon={Users}
                        label="Réservations confirmées"
                        value={confirmed}
                        accent="#7FB98E"
                    />
                </div>

                {/* Body grid */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">

                    {/* Recent bookings */}
                    <div>
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold" style={{ color: 'var(--admin-text)' }}>
                                Réservations récentes
                            </h2>
                            <Link
                                to="/admin/bookings"
                                className="flex items-center gap-1 text-xs font-medium"
                                style={{ color: 'var(--admin-accent)' }}
                            >
                                Tout voir <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div className="admin-card overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                            {/* Table header */}
                            <div
                                className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                                style={{
                                    background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                    color: 'var(--admin-muted)',
                                }}
                            >
                                <span>Client</span>
                                <span>Film</span>
                                <span>Date rés.</span>
                                <span>Statut</span>
                            </div>

                            {recentBookings === null ? (
                                <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                    Chargement…
                                </div>
                            ) : recentBookings.length === 0 ? (
                                <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                    Aucune réservation pour l'instant.
                                </div>
                            ) : (
                                recentBookings.map((b) => {
                                    const info = STATUS_INFO[b.status] ?? STATUS_INFO.expired
                                    return (
                                        <div
                                            key={b.id_booking}
                                            className="admin-row grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center gap-3 px-5 py-3.5"
                                            style={{ '--admin-row-accent': info.color }}
                                        >
                                            <div>
                                                <p className="truncate text-sm font-medium" style={{ color: 'var(--admin-text)' }}>
                                                    {b.user?.first_name} {b.user?.last_name}
                                                </p>
                                                <p className="truncate text-xs" style={{ color: 'var(--admin-muted)' }}>
                                                    {b.user?.email}
                                                </p>
                                            </div>
                                            <span className="truncate text-sm" style={{ color: 'var(--admin-muted)' }}>
                                                {b.screening?.film?.title || '—'}
                                            </span>
                                            <span className="text-xs" style={{ color: 'var(--admin-muted)' }}>
                                                {formatDate(b.created_at)}
                                            </span>
                                            <span
                                                className="inline-flex w-fit items-center rounded-full px-2 py-1 text-[11px] font-semibold"
                                                style={{ backgroundColor: info.bg, color: info.color }}
                                            >
                                                {info.label}
                                            </span>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div>
                        <h2 className="mb-4 text-base font-semibold" style={{ color: 'var(--admin-text)' }}>
                            Actions rapides
                        </h2>
                        <div className="flex flex-col gap-3">
                            <QuickAction icon={Plus}          label="Ajouter un film"    to="/admin/films/create" />
                            <QuickAction icon={CalendarClock} label="Nouvelle séance"     to="/admin/screenings/create" />
                            <QuickAction icon={Film}          label="Gérer les films"     to="/admin/films" />
                            <QuickAction icon={Ticket}        label="Voir les réservations" to="/admin/bookings" accent="#E0A458" />
                        </div>

                        {/* Split à l'affiche / à venir */}
                        {films && films.length > 0 && (
                            <div
                                className="admin-card mt-5 overflow-hidden rounded-2xl border"
                                style={{ borderColor: 'var(--admin-border)' }}
                            >
                                <div
                                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                                    style={{
                                        background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                        color: 'var(--admin-muted)',
                                    }}
                                >
                                    Catalogue
                                </div>
                                <div
                                    className="grid grid-cols-2 divide-x"
                                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                                >
                                    <div className="px-5 py-4 text-center">
                                        <p className="font-['Archivo_Black'] text-2xl" style={{ color: 'var(--admin-success)' }}>
                                            {showing ?? '—'}
                                        </p>
                                        <p className="mt-0.5 text-xs" style={{ color: 'var(--admin-muted)' }}>À l'affiche</p>
                                    </div>
                                    <div className="px-5 py-4 text-center" style={{ borderColor: 'var(--admin-border)' }}>
                                        <p className="font-['Archivo_Black'] text-2xl" style={{ color: 'var(--admin-warning)' }}>
                                            {comingSoon ?? '—'}
                                        </p>
                                        <p className="mt-0.5 text-xs" style={{ color: 'var(--admin-muted)' }}>À venir</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}