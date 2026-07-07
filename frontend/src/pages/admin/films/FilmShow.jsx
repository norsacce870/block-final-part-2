import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Film, Pencil, Trash2, ExternalLink } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import PageHeader from '../../../components/PageHeader'
import api from '../../../api/axios'

const STORAGE_URL = 'http://127.0.0.1:8000/storage/'

function FilmShow() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [film, setFilm] = useState(null)

    useEffect(() => {
        const load = async () => {
            const res = await api.get(`/films/${id}`)
            setFilm(res.data)
        }
        load()
    }, [id])

    const handleDelete = async () => {
        if (!confirm('Supprimer ce film ?')) return
        await api.delete(`/films/${id}`)
        navigate('/admin/films')
    }

    if (!film) {
        return (
            <AdminLayout>
                <div className="mx-auto max-w-4xl text-sm" style={{ color: 'var(--admin-muted)' }}>
                    Chargement…
                </div>
            </AdminLayout>
        )
    }

    const status = film.status === 'showing'
        ? { label: "À l'affiche", color: 'var(--admin-success)', bg: 'var(--admin-success-soft)' }
        : { label: 'À venir', color: 'var(--admin-warning)', bg: 'var(--admin-warning-soft)' }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-4xl">
                <PageHeader icon={Film} title={film.title} backTo="/admin/films" />

                <div
                    className="admin-card mt-7 grid grid-cols-1 gap-7 rounded-2xl border p-6 sm:grid-cols-[200px_1fr] sm:p-7"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    {film.poster ? (
                        <img
                            src={`${STORAGE_URL}${film.poster}`}
                            alt={film.title}
                            className="w-full max-w-[200px] justify-self-center rounded-xl object-cover sm:justify-self-start"
                            style={{ aspectRatio: '2/3' }}
                        />
                    ) : (
                        <div
                            className="flex w-full max-w-[200px] items-center justify-center justify-self-center rounded-xl text-sm sm:justify-self-start"
                            style={{
                                aspectRatio: '2/3',
                                backgroundColor: 'var(--admin-surface2)',
                                color: 'var(--admin-muted)',
                                border: '1px solid var(--admin-border)',
                            }}
                        >
                            Aucune affiche
                        </div>
                    )}

                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                            <InfoBlock label="Catégorie" value={film.category?.name || '—'} />
                            <InfoBlock label="Durée" value={film.duration_min ? `${film.duration_min} min` : '—'} />
                            <InfoBlock
                                label="Statut"
                                value={
                                    <span
                                        className="inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                                        style={{ backgroundColor: status.bg, color: status.color }}
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: status.color }} />
                                        {status.label}
                                    </span>
                                }
                            />
                            {film.release_date && (
                                <InfoBlock
                                    label="Date de sortie"
                                    value={new Date(film.release_date).toLocaleDateString('fr-FR')}
                                />
                            )}
                            {film.director && <InfoBlock label="Réalisation" value={film.director} />}
                        </div>

                        {film.actors && <InfoBlock label="Acteurs" value={film.actors} />}

                        {film.trailer_url && (
                            <div>
                                <Label>Bande-annonce</Label>
                                <a
                                    href={film.trailer_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1.5 inline-flex items-center gap-1.5 text-sm underline-offset-2 hover:underline"
                                    style={{ color: 'var(--admin-accent)' }}
                                >
                                    <ExternalLink size={13} />
                                    {film.trailer_url}
                                </a>
                            </div>
                        )}

                        {film.synopsis && (
                            <div>
                                <Label>Synopsis</Label>
                                <p className="mt-1.5 text-[15px] leading-[1.7]" style={{ color: 'var(--admin-text)' }}>
                                    {film.synopsis}
                                </p>
                            </div>
                        )}

                        <div className="mt-auto flex gap-2.5 pt-2">
                            <button
                                onClick={() => navigate(`/admin/films/${id}/edit`)}
                                className="admin-primary-btn flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold text-white"
                                style={{ backgroundColor: 'var(--admin-accent)', border: 'none', cursor: 'pointer' }}
                            >
                                <Pencil size={15} />
                                Modifier
                            </button>
                            <button
                                onClick={handleDelete}
                                className="admin-icon-btn flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold"
                                style={{ color: 'var(--admin-danger)', backgroundColor: 'var(--admin-danger-soft)', border: 'none', cursor: 'pointer' }}
                            >
                                <Trash2 size={15} />
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

function Label({ children }) {
    return (
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--admin-accent)' }}>
            {children}
        </span>
    )
}

function InfoBlock({ label, value }) {
    return (
        <div>
            <Label>{label}</Label>
            <div className="mt-1.5 text-sm" style={{ color: 'var(--admin-text)' }}>
                {value}
            </div>
        </div>
    )
}

export default FilmShow