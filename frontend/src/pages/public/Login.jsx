import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { login, loading } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const data = await login(email, password)
            if (data.user.role === 'admin') {
                navigate('/admin')
            } else {
                navigate('/')
            }
        } catch {
            setError('Email ou mot de passe incorrect.')
        }
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#9aafd4', fontSize: '0.875rem' }}>E-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                width: '100%',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#9aafd4', fontSize: '0.875rem' }}>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                color: 'white',
                                fontSize: '0.95rem',
                                outline: 'none',
                                width: '100%',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <Link to="/forgot-password" style={{ color: '#9aafd4', fontSize: '0.875rem', textDecoration: 'underline' }}>
                            Mot de passe oublié ?
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
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </div>
                </form>
            </div>

            <p style={{ color: '#8a94a8', fontSize: '0.875rem' }}>
                Pas encore de compte ?{' '}
                <Link to="/register" style={{ color: '#9aafd4', textDecoration: 'underline' }}>
                    S'inscrire
                </Link>
            </p>
        </div>
    )
}

export default Login