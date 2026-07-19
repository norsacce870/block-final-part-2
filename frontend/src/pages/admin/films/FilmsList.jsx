import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Plus, Eye, Film as FilmIcon } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import PageHeader from '../../../components/PageHeader'
import api from '../../../api/axios'
import { STORAGE_URL } from '../../../utils/storageUrl'

function FilmsList() {
    const [films, setFilms] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const res = await api.get('/films')
            setFilms(res.data)
            setLoading(false)
        }
        load()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm('Supprimer ce film ?')) return
        await api.delete(`/films/${id}`)
        setFilms(films.filter(f => f.id_film !== id))
    }

    const statusInfo = (status) =>
        status === 'showing'
            ? { label: "À l'affiche", color: 'var(--admin-success)', bg: 'var(--admin-success-soft)' }
            : { label: 'À venir', color: 'var(--admin-warning)', bg: 'var(--admin-warning-soft)' }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-6xl">
                <PageHeader
                    icon={FilmIcon}
                    title="Films"
                    subtitle="Le catalogue complet, à l'affiche et à venir."
                    action={
                        <button
                            onClick={() => navigate('/admin/films/create')}
                            className="admin-primary-btn flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold text-white"
                            style={{ backgroundColor: 'var(--admin-accent)', border: 'none', cursor: 'pointer' }}
                        >
                            <Plus size={16} />
                            Ajouter un film
                        </button>
                    }
                />

                <div className="admin-card mt-7 overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                    <div className="min-w-[860px]">
                        <div
                            className="grid grid-cols-[80px_1.4fr_0.9fr_0.7fr_1fr_auto] gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                color: 'var(--admin-muted)',
                            }}
                        >
                            <span>Affiche</span>
                            <span>Titre</span>
                            <span>Catégorie</span>
                            <span>Durée</span>
                            <span>Statut</span>
                            <span>Actions</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                Chargement…
                            </div>
                        ) : films.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center" style={{ color: 'var(--admin-muted)' }}>
                                <FilmIcon size={22} style={{ opacity: 0.5 }} />
                                <p className="text-sm">Aucun film pour le moment.</p>
                            </div>
                        ) : (
                            films.map((film) => {
                                const status = statusInfo(film.status)
                                return (
                                    <div
                                        key={film.id_film}
                                        className="admin-row grid grid-cols-[80px_1.4fr_0.9fr_0.7fr_1fr_auto] items-center gap-4 px-5 py-3.5"
                                        style={{ '--admin-row-accent': status.color }}
                                    >
                                        {film.poster ? (
                                            <img
                                                src={`${STORAGE_URL}${film.poster}`}
                                                alt={film.title}
                                                className="h-[72px] w-[52px] rounded-md object-cover"
                                                style={{ border: '1px solid var(--admin-border)' }}
                                            />
                                        ) : (
                                            <div
                                                className="flex h-[72px] w-[52px] items-center justify-center rounded-md text-[9px]"
                                                style={{
                                                    backgroundColor: 'var(--admin-surface2)',
                                                    color: 'var(--admin-muted)',
                                                    border: '1px solid var(--admin-border)',
                                                }}
                                            >
                                                N/A
                                            </div>
                                        )}

                                        <span className="truncate text-[15px] font-medium" style={{ color: 'var(--admin-text)' }}>
                                            {film.title}
                                        </span>

                                        <span className="truncate text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {film.category?.name || '—'}
                                        </span>

                                        <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {film.duration_min ? `${film.duration_min} min` : '—'}
                                        </span>

                                        <span>
                                            <span
                                                className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                                                style={{ backgroundColor: status.bg, color: status.color }}
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                                                {status.label}
                                            </span>
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/films/${film.id_film}`}
                                                aria-label="Voir"
                                                title="Voir"
                                                className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)' }}
                                            >
                                                <Eye size={14} />
                                            </Link>
                                            <Link
                                                to={`/admin/films/${film.id_film}/edit`}
                                                aria-label="Modifier"
                                                title="Modifier"
                                                className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)' }}
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(film.id_film)}
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

export default FilmsList