import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import PageHeader from '../../components/PageHeader'
import AdminPagination from '../../components/AdminPagination'
import api from '../../api/axios'
import { Plus, Pencil, Trash2, X, AlertCircle, Tag } from 'lucide-react'

function Categories() {
    const [categories, setCategories] = useState([])
    const [name, setName] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchCategories = async () => {
        const res = await api.get('/categories', { params: { page } })
        setCategories(res.data.data)
        setLastPage(res.data.last_page)
        setTotal(res.data.total)
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await fetchCategories()
            setLoading(false)
        }
        load()
    }, [page])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editId) {
                await api.put(`/categories/${editId}`, { name })
            } else {
                await api.post('/categories', { name })
            }
            setName('')
            setEditId(null)
            fetchCategories()
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const handleEdit = (cat) => {
        setEditId(cat.id_category)
        setName(cat.name)
        setError('')
    }

    const cancelEdit = () => {
        setEditId(null)
        setName('')
        setError('')
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette catégorie ?')) return
        await api.delete(`/categories/${id}`)
        if (categories.length === 1 && page > 1) {
            setPage(page - 1)
        } else {
            fetchCategories()
        }
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-3xl">
                <PageHeader
                    icon={Tag}
                    title="Catégories"
                    subtitle="Les genres utilisés pour classer les films sur le site."
                />

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="admin-card mt-7 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nom de la catégorie"
                        aria-label="Nom de la catégorie"
                        required
                        className="admin-input flex-1 rounded-xl border px-4 py-3 text-[15px] outline-none"
                        style={{
                            backgroundColor: 'var(--admin-surface2)',
                            borderColor: 'var(--admin-border)',
                            color: 'var(--admin-text)',
                        }}
                    />
                    <div className="flex gap-2.5">
                        {editId && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium"
                                style={{ color: 'var(--admin-muted)', backgroundColor: 'transparent', border: '1px solid var(--admin-border)' }}
                            >
                                <X size={15} />
                                Annuler
                            </button>
                        )}
                        <button
                            type="submit"
                            className="admin-primary-btn flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold text-white sm:flex-none"
                            style={{ backgroundColor: 'var(--admin-accent)' }}
                        >
                            {editId ? <Pencil size={15} /> : <Plus size={16} />}
                            {editId ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div
                        className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                        style={{ backgroundColor: 'var(--admin-danger-soft)', color: 'var(--admin-danger)' }}
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="admin-card mt-7 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                    <div
                        className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                        style={{
                            background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                            color: 'var(--admin-muted)',
                        }}
                    >
                        <span>Nom</span>
                        <span>Actions</span>
                    </div>

                    {loading ? (
                        <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                            Chargement…
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 px-5 py-12 text-center" style={{ color: 'var(--admin-muted)' }}>
                            <Tag size={22} style={{ opacity: 0.5 }} />
                            <p className="text-sm">Aucune catégorie pour l'instant.</p>
                        </div>
                    ) : (
                        categories.map((cat) => (
                            <div
                                key={cat.id_category}
                                className="admin-row grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-3.5"
                                style={{ '--admin-row-accent': 'var(--admin-accent)' }}
                            >
                                <span className="text-[15px]" style={{ color: 'var(--admin-text)' }}>
                                    {cat.name}
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleEdit(cat)}
                                        aria-label={`Modifier ${cat.name}`}
                                        className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                        style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat.id_category)}
                                        aria-label={`Supprimer ${cat.name}`}
                                        className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                        style={{ color: 'var(--admin-danger)', backgroundColor: 'var(--admin-danger-soft)', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    <AdminPagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
                </div>
            </div>
        </AdminLayout>
    )
}

export default Categories