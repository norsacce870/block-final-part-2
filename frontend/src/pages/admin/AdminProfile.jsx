import { useState, useEffect } from 'react'
import AdminLayout from '../../components/AdminLayout'
import PageHeader from '../../components/PageHeader'
import FormField from '../../components/FormField'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { UserCircle, Check, X, AlertCircle, KeyRound } from 'lucide-react'

function AdminProfile() {
    const { user } = useAuth()

    // Info form
    const [info, setInfo] = useState({ first_name: '', last_name: '', email: '' })
    const [editing, setEditing] = useState(false)
    const [infoBackup, setInfoBackup] = useState(null)
    const [infoError, setInfoError] = useState('')
    const [infoSaving, setInfoSaving] = useState(false)

    // Password form
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
    const [pwErrors, setPwErrors] = useState({})
    const [pwSaving, setPwSaving] = useState(false)
    const [pwSuccess, setPwSuccess] = useState('')

    // Toast
    const [toast, setToast] = useState('')

    useEffect(() => {
        if (user) {
            setInfo({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
            })
        }
    }, [user])

    const showToast = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3200)
    }

    // ── info ────────────────────────────────────────────────────────────────

    const startEdit = () => {
        setInfoBackup({ ...info })
        setEditing(true)
        setInfoError('')
    }

    const cancelEdit = () => {
        setInfo(infoBackup)
        setEditing(false)
        setInfoError('')
    }

    const saveInfo = async () => {
        if (!info.first_name.trim() || !info.last_name.trim()) {
            setInfoError('Le prénom et le nom sont requis.')
            return
        }
        setInfoSaving(true)
        try {
            await api.put('/user', info)
            setEditing(false)
            showToast('Informations mises à jour !')
        } catch (err) {
            setInfoError(err?.response?.data?.message || 'Erreur lors de la sauvegarde.')
        } finally {
            setInfoSaving(false)
        }
    }

    // ── password ─────────────────────────────────────────────────────────────

    const savePw = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!pw.current) errs.current = 'Requis.'
        if (!pw.next || pw.next.length < 8) errs.next = '8 caractères minimum.'
        if (pw.next !== pw.confirm) errs.confirm = 'Les mots de passe ne correspondent pas.'
        setPwErrors(errs)
        if (Object.keys(errs).length) return

        setPwSaving(true)
        setPwSuccess('')
        try {
            await api.put('/user/password', {
                current_password: pw.current,
                password: pw.next,
                password_confirmation: pw.confirm,
            })
            setPw({ current: '', next: '', confirm: '' })
            showToast('Mot de passe mis à jour !')
        } catch (err) {
            setPwErrors({
                current: err?.response?.data?.message || 'Mot de passe actuel incorrect.',
            })
        } finally {
            setPwSaving(false)
        }
    }

    const inputStyle = {
        backgroundColor: 'var(--admin-surface2)',
        borderColor: 'var(--admin-border)',
        color: 'var(--admin-text)',
    }

    const initials = `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase()

    return (
        <AdminLayout>
            <div className="mx-auto max-w-2xl">
                <PageHeader
                    icon={UserCircle}
                    title="Mon profil"
                    subtitle="Gérez vos informations personnelles et votre sécurité."
                />

                {/* Avatar + name recap */}
                <div
                    className="admin-card mt-7 flex items-center gap-5 rounded-2xl border p-5"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <div
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[18px] font-['Sora'] text-[22px] font-bold text-white"
                        style={{ background: 'linear-gradient(145deg,#3A6EA5,#17286D)', border: '1.5px solid rgba(94,148,206,.4)' }}
                    >
                        {initials || '?'}
                    </div>
                    <div>
                        <p className="font-['Sora'] text-lg font-semibold" style={{ color: 'var(--admin-text)' }}>
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p className="mt-0.5 text-sm" style={{ color: 'var(--admin-muted)' }}>
                            {user?.email}
                        </p>
                        <span
                            className="mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                            style={{ backgroundColor: 'var(--admin-accent-soft)', color: 'var(--admin-accent)' }}
                        >
                            Administrateur
                        </span>
                    </div>
                </div>

                {/* ── Informations ── */}
                <div
                    className="admin-card mt-5 rounded-2xl border p-6"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-['Sora'] text-[20px] font-semibold" style={{ color: 'var(--admin-text)' }}>
                            Informations personnelles
                        </h2>
                        {!editing && (
                            <button
                                type="button"
                                onClick={startEdit}
                                className="flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium"
                                style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-muted)', background: 'transparent' }}
                            >
                                Modifier
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField label="Prénom">
                            <input
                                value={info.first_name}
                                onChange={(e) => setInfo((i) => ({ ...i, first_name: e.target.value }))}
                                disabled={!editing}
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                        </FormField>
                        <FormField label="Nom">
                            <input
                                value={info.last_name}
                                onChange={(e) => setInfo((i) => ({ ...i, last_name: e.target.value }))}
                                disabled={!editing}
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                        </FormField>
                        <FormField label="Adresse e-mail" className="sm:col-span-2">
                            <input
                                type="email"
                                value={info.email}
                                onChange={(e) => setInfo((i) => ({ ...i, email: e.target.value }))}
                                disabled={!editing}
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                        </FormField>
                    </div>

                    {infoError && (
                        <div
                            className="mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
                            style={{ backgroundColor: 'var(--admin-danger-soft)', color: 'var(--admin-danger)' }}
                        >
                            <AlertCircle size={15} className="shrink-0" />
                            {infoError}
                        </div>
                    )}

                    {editing && (
                        <div className="mt-5 flex gap-2.5">
                            <button
                                type="button"
                                onClick={saveInfo}
                                disabled={infoSaving}
                                className="admin-primary-btn flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                                style={{ backgroundColor: 'var(--admin-accent)', border: 'none' }}
                            >
                                <Check size={15} />
                                {infoSaving ? 'Enregistrement…' : 'Enregistrer'}
                            </button>
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="flex items-center gap-1.5 rounded-xl border px-5 py-3 text-sm font-semibold"
                                style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)', background: 'transparent' }}
                            >
                                <X size={15} />
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Sécurité ── */}
                <div
                    className="admin-card mt-5 rounded-2xl border p-6"
                    style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}
                >
                    <div className="mb-6 flex items-center gap-3">
                        <KeyRound size={18} style={{ color: 'var(--admin-accent)' }} />
                        <h2 className="font-['Sora'] text-[20px] font-semibold" style={{ color: 'var(--admin-text)' }}>
                            Mot de passe
                        </h2>
                    </div>
                    <p className="mb-5 text-sm" style={{ color: 'var(--admin-muted)' }}>
                        Choisissez un mot de passe d'au moins 8 caractères.
                    </p>

                    <form onSubmit={savePw} className="flex flex-col gap-4">
                        <FormField label="Mot de passe actuel">
                            <input
                                type="password"
                                value={pw.current}
                                onChange={(e) => { setPw((p) => ({ ...p, current: e.target.value })); setPwErrors((er) => ({ ...er, current: '' })) }}
                                autoComplete="current-password"
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                            {pwErrors.current && <ErrMsg>{pwErrors.current}</ErrMsg>}
                        </FormField>

                        <FormField label="Nouveau mot de passe">
                            <input
                                type="password"
                                value={pw.next}
                                onChange={(e) => { setPw((p) => ({ ...p, next: e.target.value })); setPwErrors((er) => ({ ...er, next: '' })) }}
                                autoComplete="new-password"
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                            {pwErrors.next && <ErrMsg>{pwErrors.next}</ErrMsg>}
                        </FormField>

                        <FormField label="Confirmer le nouveau mot de passe">
                            <input
                                type="password"
                                value={pw.confirm}
                                onChange={(e) => { setPw((p) => ({ ...p, confirm: e.target.value })); setPwErrors((er) => ({ ...er, confirm: '' })) }}
                                autoComplete="new-password"
                                className="admin-input w-full rounded-xl border px-4 py-3 text-[15px] outline-none"
                                style={inputStyle}
                            />
                            {pwErrors.confirm && <ErrMsg>{pwErrors.confirm}</ErrMsg>}
                        </FormField>

                        <button
                            type="submit"
                            disabled={pwSaving}
                            className="admin-primary-btn mt-1 self-start rounded-xl px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
                            style={{ backgroundColor: 'var(--admin-accent)', border: 'none' }}
                        >
                            {pwSaving ? 'Mise à jour…' : 'Mettre à jour'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div
                    className="fixed bottom-7 left-1/2 z-[120] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-2xl border px-6 py-4 shadow-[0_20px_60px_rgba(0,0,0,.4)]"
                    style={{ backgroundColor: 'var(--admin-surface2)', borderColor: 'var(--admin-accent)' }}
                >
                    <Check size={16} style={{ color: 'var(--admin-accent)', flexShrink: 0 }} />
                    <span className="text-[14px] font-medium" style={{ color: 'var(--admin-text)' }}>{toast}</span>
                </div>
            )}
        </AdminLayout>
    )
}

function ErrMsg({ children }) {
    return (
        <span className="mt-1.5 block text-[12.5px]" style={{ color: 'var(--admin-danger)' }}>
            {children}
        </span>
    )
}

export default AdminProfile