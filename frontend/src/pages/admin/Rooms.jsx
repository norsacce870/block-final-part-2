import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import PageHeader from '../../components/PageHeader'
import AdminPagination from '../../components/AdminPagination'
import api from '../../api/axios'
import { Plus, Pencil, Trash2, X, AlertCircle, DoorOpen, ChevronDown } from 'lucide-react'

function Rooms() {
    const [rooms, setRooms] = useState([])
    const [name, setName] = useState('')
    const [capacity, setCapacity] = useState('')
    const [format, setFormat] = useState('standard')
    const [price, setPrice] = useState('')
    const [editId, setEditId] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [total, setTotal] = useState(0)

    const fetchRooms = async () => {
        const res = await api.get('/rooms', { params: { page } })
        setRooms(res.data.data)
        setLastPage(res.data.last_page)
        setTotal(res.data.total)
    }

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            await fetchRooms()
            setLoading(false)
        }
        load()
    }, [page])

    const resetForm = () => {
        setEditId(null)
        setName('')
        setCapacity('')
        setFormat('standard')
        setPrice('')
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        const payload = { name, capacity, format, price }
        try {
            if (editId) {
                await api.put(`/rooms/${editId}`, payload)
            } else {
                await api.post('/rooms', payload)
            }
            resetForm()
            fetchRooms()
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const handleEdit = (room) => {
        setEditId(room.id_room)
        setName(room.name)
        setCapacity(room.capacity)
        setFormat(room.format || 'standard')
        setPrice(room.price ?? '')
        setError('')
    }

    const handleDelete = async (id) => {
        if (!confirm('Supprimer cette salle ?')) return
        try {
            await api.delete(`/rooms/${id}`)
            if (rooms.length === 1 && page > 1) {
                setPage(page - 1)
            } else {
                fetchRooms()
            }
        } catch {
            setError('Impossible de supprimer une salle avec des séances.')
        }
    }

    const inputStyle = {
        backgroundColor: 'var(--admin-surface2)',
        borderColor: 'var(--admin-border)',
        color: 'var(--admin-text)',
    }

    return (
        <AdminLayout>
            <div className="mx-auto max-w-4xl">
                <PageHeader
                    icon={DoorOpen}
                    title="Salles"
                    subtitle="Tes salles de projection, leur capacité et leur tarif."
                />

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="admin-card mt-7 flex flex-col gap-3 rounded-2xl border p-5"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr]">
                        <Field label="Nom de la salle">
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Salle 1"
                                required
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                        </Field>

                        <Field label="Capacité">
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                placeholder="120"
                                required
                                min="1"
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                        </Field>

                        <Field label="Format">
                            <div className="relative">
                                <select
                                    value={format}
                                    onChange={(e) => setFormat(e.target.value)}
                                    required
                                    className="admin-input w-full appearance-none rounded-xl border py-3 pl-4 pr-9 text-[15px] outline-none"
                                    style={inputStyle}
                                >
                                    <option value="standard">Standard</option>
                                    <option value="imax">IMAX</option>
                                    <option value="vip">VIP Lounge</option>
                                </select>
                                <ChevronDown
                                    size={16}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
                                    style={{ color: 'var(--admin-muted)' }}
                                />
                            </div>
                        </Field>

                        <Field label="Prix / place">
                            <div className="relative">
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="9.00"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="admin-input w-full rounded-xl border py-3 pl-4 pr-8 text-[15px] outline-none"
                                    style={inputStyle}
                                />
                                <span
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm"
                                    style={{ color: 'var(--admin-muted)' }}
                                >
                                    €
                                </span>
                            </div>
                        </Field>
                    </div>

                    <div className="flex justify-end gap-2.5">
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium"
                                style={{ color: 'var(--admin-muted)', backgroundColor: 'transparent', border: '1px solid var(--admin-border)' }}
                            >
                                <X size={15} />
                                Annuler
                            </button>
                        )}
                        <button
                            type="submit"
                            className="admin-primary-btn flex items-center gap-1.5 whitespace-nowrap rounded-xl px-5 py-3 text-sm font-semibold text-white"
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
                <div className="admin-card mt-7 overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--admin-border)' }}>
                    <div className="min-w-[640px]">
                        <div
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide"
                            style={{
                                background: 'linear-gradient(135deg, var(--admin-accent-soft), var(--admin-surface2))',
                                color: 'var(--admin-muted)',
                            }}
                        >
                            <span>Nom</span>
                            <span>Capacité</span>
                            <span>Format</span>
                            <span>Prix</span>
                            <span>Actions</span>
                        </div>

                        {loading ? (
                            <div className="px-5 py-10 text-center text-sm" style={{ color: 'var(--admin-muted)' }}>
                                Chargement…
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 px-5 py-12 text-center" style={{ color: 'var(--admin-muted)' }}>
                                <DoorOpen size={22} style={{ opacity: 0.5 }} />
                                <p className="text-sm">Aucune salle pour l'instant.</p>
                            </div>
                        ) : (
                            rooms.map((room) => {
                                const isImax = room.format === 'imax'
                                return (
                                    <div
                                        key={room.id_room}
                                        className="admin-row grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-3.5"
                                        style={{ '--admin-row-accent': isImax ? 'var(--admin-accent)' : 'var(--admin-border)' }}
                                    >
                                        <span className="text-[15px]" style={{ color: 'var(--admin-text)' }}>
                                            {room.name}
                                        </span>
                                        <span className="text-sm" style={{ color: 'var(--admin-muted)' }}>
                                            {room.capacity} places
                                        </span>
                                        <span>
                                            <span
                                                className="inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                                style={
                                                    room.format === 'imax'
                                                        ? { backgroundColor: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }
                                                        : room.format === 'vip'
                                                        ? { backgroundColor: 'var(--admin-warning-soft)', color: 'var(--admin-warning)' }
                                                        : { backgroundColor: 'var(--admin-surface2)', color: 'var(--admin-muted)' }
                                                }
                                            >
                                                {room.format === 'imax' ? 'IMAX' : room.format === 'vip' ? 'VIP Lounge' : 'Standard'}
                                            </span>
                                        </span>
                                        <span className="text-sm" style={{ color: 'var(--admin-text)' }}>
                                            {Number(room.price ?? 0).toFixed(2)} €
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(room)}
                                                aria-label={`Modifier ${room.name}`}
                                                className="admin-icon-btn flex h-8 w-8 items-center justify-center rounded-lg"
                                                style={{ color: 'var(--admin-text)', backgroundColor: 'var(--admin-surface2)', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id_room)}
                                                aria-label={`Supprimer ${room.name}`}
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

                    <AdminPagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
                </div>
            </div>
        </AdminLayout>
    )
}

function Field({ label, children }) {
    return (
        <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'var(--admin-muted)' }}>
                {label}
            </span>
            {children}
        </label>
    )
}

export default Rooms