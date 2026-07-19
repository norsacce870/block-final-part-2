import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { AdminThemeProvider, useAdminTheme } from '../context/AdminThemeProvider'
import { Menu, X, Sun, Moon, ChevronDown, Home } from 'lucide-react'

function AdminLayout({ children }) {
    return (
        <AdminThemeProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </AdminThemeProvider>
    )
}

function AdminLayoutContent({ children }) {
    const { logout, user } = useAuth()
    const { theme, toggleTheme } = useAdminTheme()
    const navigate = useNavigate()
    const location = useLocation()
    const [menuOpen, setMenuOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        const onClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
        }
        document.addEventListener('mousedown', onClick)
        return () => document.removeEventListener('mousedown', onClick)
    }, [])

    // Close the mobile menu if the window is resized past the breakpoint
    // where the inline nav reappears, so it can't get stuck open behind it.
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 1024) setMobileOpen(false)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const handleLogout = async () => {
        await logout()
        navigate('/login')
    }

    const navItems = [
        { to: '/admin', label: 'Tableau de bord', exact: true },
        { to: '/admin/categories', label: 'Catégories' },
        { to: '/admin/films', label: 'Films' },
        { to: '/admin/rooms', label: 'Salles' },
        { to: '/admin/screenings', label: 'Séances' },
        { to: '/admin/bookings', label: 'Réservations' },
    ]

    const isActive = (item) =>
        item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

    return (
        <div
            className="min-h-screen overflow-x-hidden font-sans"
            style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}
        >
            <nav
                className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b px-4 sm:px-6"
                style={{ backgroundColor: 'var(--admin-nav)', borderColor: 'var(--admin-border)' }}
            >
                {/* Logo */}
                <div className="shrink-0" style={{ lineHeight: 1.1 }}>
                    <div
                        style={{
                            color: 'var(--admin-text)',
                            fontFamily: '"Archivo Black", sans-serif',
                            fontSize: '1.4rem',
                            letterSpacing: '-0.05em',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        BAOBAB
                    </div>
                    <div
                        style={{
                            color: 'var(--admin-wordmark)',
                            fontFamily: '"Inter", sans-serif',
                            fontWeight: 300,
                            fontSize: '0.78rem',
                            letterSpacing: '0.8em',
                            marginTop: '2px',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        CINÉMA
                    </div>
                </div>

                {/* Nav links — hidden on mobile, centered on desktop */}
                <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
                    {navItems.map((item) => {
                        const active = isActive(item)
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                className="relative py-1.5 font-sans text-[0.95rem] transition-colors"
                                style={{
                                    color: active ? 'var(--admin-text)' : 'var(--admin-muted)',
                                    fontWeight: active ? 600 : 400,
                                }}
                            >
                                {item.label}
                                {active && (
                                    <span
                                        className="absolute inset-x-0 -bottom-1 h-[2px] rounded-full"
                                        style={{ backgroundColor: 'var(--admin-accent)' }}
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Right: back to site + theme toggle + user menu + hamburger */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        to="/"
                        aria-label="Retour au site"
                        className="flex items-center gap-1.5 rounded-lg border px-3 py-2 font-sans text-[0.85rem] transition-colors"
                        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                    >
                        <Home size={16} />
                        <span className="hidden sm:inline">Retour au site</span>
                    </Link>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Changer de thème"
                        className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                        style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text)' }}
                    >
                        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
                    </button>

                    {/* User menu — hidden on mobile */}
                    <div className="relative hidden lg:block" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-sans text-[0.95rem] transition-colors"
                            style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            {user?.first_name || 'Utilisateur'}
                            <ChevronDown
                                size={15}
                                style={{
                                    transition: 'transform 0.2s',
                                    transform: menuOpen ? 'rotate(180deg)' : 'none',
                                }}
                            />
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 top-[calc(100%+10px)] z-[100] min-w-[200px] overflow-hidden rounded-lg border shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                                style={{ backgroundColor: 'var(--admin-surface2)', borderColor: 'var(--admin-border)' }}
                            >
                                <Link
                                    to="/admin/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-5 py-3.5 font-sans text-[0.95rem] transition-colors hover:opacity-80"
                                    style={{ color: 'var(--admin-text)' }}
                                >
                                    Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-5 py-3.5 text-left font-sans text-[0.95rem] transition-colors hover:opacity-80"
                                    style={{ color: 'var(--admin-text)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                >
                                    Se déconnecter
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Hamburger — visible on mobile */}
                    <button
                        className="flex h-9 w-9 items-center justify-center lg:hidden"
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={mobileOpen}
                        style={{ background: 'transparent', border: 'none', color: 'var(--admin-text)', cursor: 'pointer' }}
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </nav>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    className="flex flex-col gap-1 border-b px-5 py-3 lg:hidden"
                    style={{ backgroundColor: 'var(--admin-nav)', borderColor: 'var(--admin-border)' }}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="border-b py-3 font-sans text-[0.95rem] transition-colors"
                            style={{
                                color: isActive(item) ? 'var(--admin-text)' : 'var(--admin-muted)',
                                borderColor: 'var(--admin-border)',
                                fontWeight: isActive(item) ? 600 : 400,
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={handleLogout}
                        className="py-3 text-left font-sans text-[0.95rem] transition-colors"
                        style={{ color: 'var(--admin-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        Se déconnecter
                    </button>
                </div>
            )}

            <main className="p-5 sm:p-8" style={{ color: 'var(--admin-text)' }}>
                {children}
            </main>
        </div>
    )
}

export default AdminLayout