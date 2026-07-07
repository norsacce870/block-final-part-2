import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Register() {
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', password: '', password_confirmation: ''
    })
    const [error, setError] = useState('')
    const { register, loading } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.password_confirmation) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }
        try {
            await register(form)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription.')
        }
    }

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        color: 'white',
        fontSize: '0.95rem',
        outline: 'none',
        width: '100%',
    }

    const labelStyle = {
        color: '#9aafd4',
        fontSize: '0.875rem',
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0f1729',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2.5rem',
        }}>
            {/* Logo */}
            <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
                <div style={{
                    color: 'white',
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: '2rem',
                    letterSpacing: '-0.05em',
                }}>BAOBAB</div>
                <div style={{
                    color: '#9aafd4',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 300,
                    fontSize: '0.7rem',
                    letterSpacing: '0.8em',
                    marginTop: '2px',
                }}>CINÉMA</div>
            </div>

            {/* Formulaire */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: '#1a2238',
                borderRadius: '12px',
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                {error && (
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#f87171',
                        fontSize: '0.875rem',
                        border: '1px solid rgba(239,68,68,0.2)',
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={labelStyle}>Prénom</label>
                            <input
                                name="first_name"
                                value={form.first_name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={labelStyle}>Nom</label>
                            <input
                                name="last_name"
                                value={form.last_name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={labelStyle}>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={labelStyle}>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={labelStyle}>Confirmer le mot de passe</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <Link to="/login" style={{ color: '#9aafd4', fontSize: '0.875rem', textDecoration: 'underline' }}>
                            Déjà inscrit·e ?
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: '#17286D',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                            }}
                        >
                            {loading ? 'Inscription...' : 'Inscription'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register