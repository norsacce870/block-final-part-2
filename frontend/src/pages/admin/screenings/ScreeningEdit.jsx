import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CalendarClock, ChevronDown, AlertCircle, X, Check } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import PageHeader from '../../../components/PageHeader'
import FormField from '../../../components/FormField'
import api from '../../../api/axios'

function ScreeningEdit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [films, setFilms] = useState([])
    const [rooms, setRooms] = useState([])
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        id_film: '', id_room: '', date: '', time: '', seats_remaining: ''
    })

    useEffect(() => {
        const load = async () => {
            const [screeningRes, filmsRes, roomsRes] = await Promise.all([
                api.get(`/screenings/${id}`),
                api.get('/films'),
                api.get('/rooms')
            ])
            const s = screeningRes.data
            setForm({
                id_film: s.id_film,
                id_room: s.id_room,
                date: s.date,
                time: s.time,
                seats_remaining: s.seats_remaining
            })
            setFilms(filmsRes.data)
            setRooms(roomsRes.data)
        }
        load()
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await api.put(`/screenings/${id}`, form)
            navigate('/admin/screenings')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur.')
        }
    }

    const inputStyle = {
        backgroundColor: 'var(--admin-surface2)',
        borderColor: 'var(--admin-border)',
        color: 'var(--admin-text)',
    }
    const inputClass = "admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
    const selectClass = "admin-input w-full appearance-none rounded-xl border px-4 py-3 pr-9 text-[15px] outline-none"

    return (
        <AdminLayout>
            <div className="mx-auto max-w-2xl">
                <PageHeader
                    icon={CalendarClock}
                    title="Modifier la séance"
                    backTo="/admin/screenings"
                />

                {error && (
                    <div
                        className="mt-6 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                        style={{ backgroundColor: 'var(--admin-danger-soft)', color: 'var(--admin-danger)' }}
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="admin-card mt-6 rounded-2xl border p-6"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Film *" className="sm:col-span-2">
                            <div className="relative">
                                <select name="id_film" value={form.id_film} onChange={handleChange} required className={selectClass} style={inputStyle}>
                                    <option value="">-- Sélectionner un film --</option>
                                    {films.map(f => (
                                        <option key={f.id_film} value={f.id_film}>{f.title}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--admin-muted)' }} />
                            </div>
                        </FormField>

                        <FormField label="Salle *" className="sm:col-span-2">
                            <div className="relative">
                                <select name="id_room" value={form.id_room} onChange={handleChange} required className={selectClass} style={inputStyle}>
                                    <option value="">-- Sélectionner une salle --</option>
                                    {rooms.map(r => (
                                        <option key={r.id_room} value={r.id_room}>{r.name} ({r.capacity} places)</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--admin-muted)' }} />
                            </div>
                        </FormField>

                        <FormField label="Date *">
                            <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Heure *">
                            <input name="time" type="time" value={form.time} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Places disponibles *" className="sm:col-span-2">
                            <input name="seats_remaining" type="number" value={form.seats_remaining} onChange={handleChange} required min="0" className={inputClass} style={inputStyle} />
                        </FormField>
                    </div>

                    <div className="mt-6 flex gap-2.5">
                        <button
                            type="submit"
                            className="admin-primary-btn flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold text-white"
                            style={{ backgroundColor: 'var(--admin-accent)' }}
                        >
                            <Check size={15} />
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/screenings')}
                            className="flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-medium"
                            style={{ color: 'var(--admin-muted)', backgroundColor: 'transparent', border: '1px solid var(--admin-border)' }}
                        >
                            <X size={15} />
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}

export default ScreeningEdit