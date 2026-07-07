import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Film, ChevronDown, AlertCircle, X, Check } from 'lucide-react'
import AdminLayout from '../../../components/AdminLayout'
import PageHeader from '../../../components/PageHeader'
import FormField from '../../../components/FormField'
import PosterUpload from '../../../components/PosterUpload'
import api from '../../../api/axios'

function FilmCreate() {
    const navigate = useNavigate()
    const [categories, setCategories] = useState([])
    const [error, setError] = useState('')
    const [posterFile, setPosterFile] = useState(null)
    const [form, setForm] = useState({
        title: '', synopsis: '', duration_min: '', director: '',
        actors: '', release_date: '', trailer_url: '', status: 'coming_soon', id_category: ''
    })

    useEffect(() => {
        const load = async () => {
            const res = await api.get('/categories')
            setCategories(res.data)
        }
        load()
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const formData = new FormData()
            Object.keys(form).forEach(key => {
                if (form[key] !== '') formData.append(key, form[key])
            })
            if (posterFile) formData.append('poster', posterFile)
            await api.post('/films', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            navigate('/admin/films')
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
                <PageHeader icon={Film} title="Ajouter un film" backTo="/admin/films" />

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
                        <FormField label="Titre *" className="sm:col-span-2">
                            <input name="title" value={form.title} onChange={handleChange} required className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Catégorie">
                            <div className="relative">
                                <select name="id_category" value={form.id_category} onChange={handleChange} className={selectClass} style={inputStyle}>
                                    <option value="">-- Aucune --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id_category} value={cat.id_category}>{cat.name}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--admin-muted)' }} />
                            </div>
                        </FormField>

                        <FormField label="Statut *">
                            <div className="relative">
                                <select name="status" value={form.status} onChange={handleChange} className={selectClass} style={inputStyle}>
                                    <option value="coming_soon">À venir</option>
                                    <option value="showing">À l'affiche</option>
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--admin-muted)' }} />
                            </div>
                        </FormField>

                        <FormField label="Durée (min)">
                            <input name="duration_min" type="number" value={form.duration_min} onChange={handleChange} className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Date de sortie">
                            <input name="release_date" type="date" value={form.release_date} onChange={handleChange} className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Réalisation">
                            <input name="director" value={form.director} onChange={handleChange} placeholder="Nom du réalisateur" className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Acteurs">
                            <input name="actors" value={form.actors} onChange={handleChange} placeholder="Séparés par une virgule" className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Bande-annonce (URL)" className="sm:col-span-2" hint="YouTube ou Vimeo — ex. https://www.youtube.com/watch?v=...">
                            <input name="trailer_url" type="url" value={form.trailer_url} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} style={inputStyle} />
                        </FormField>

                        <FormField label="Synopsis" className="sm:col-span-2">
                            <textarea name="synopsis" value={form.synopsis} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} style={inputStyle} />
                        </FormField>

                        <FormField label="Affiche" className="sm:col-span-2">
                            <PosterUpload onChange={setPosterFile} />
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
                            onClick={() => navigate('/admin/films')}
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

export default FilmCreate