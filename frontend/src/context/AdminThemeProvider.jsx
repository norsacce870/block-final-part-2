import { createContext, useContext, useEffect, useState } from 'react'

const AdminThemeContext = createContext(null)
const STORAGE_KEY = 'baobab-admin-theme'

// Dark keeps the palette already in use across the admin (#0f1729 / #1a2238
// / #2a3654); light is a new, sober counterpart built from the same brand
// accent (#3A6EA5) so toggling never feels like a different app.
const THEMES = {
  dark: {
    '--admin-bg': '#0f1729',
    '--admin-nav': '#1a2238',
    '--admin-surface': '#161f38',
    '--admin-surface2': '#2a3654',
    '--admin-border': 'rgba(255,255,255,0.08)',
    '--admin-text': '#ffffff',
    '--admin-muted': '#8a94a8',
    '--admin-wordmark': '#9aafd4',
    '--admin-accent': '#3A6EA5',
    '--admin-accent-soft': 'rgba(58,110,165,0.16)',
    '--admin-shadow': '0 20px 50px rgba(0,0,0,0.35)',
    '--admin-danger': '#D9534F',
    '--admin-danger-hover': '#C9433F',
    '--admin-danger-soft': 'rgba(217,83,79,0.14)',
    '--admin-success': '#7FB98E',
    '--admin-success-soft': 'rgba(127,185,142,0.16)',
    '--admin-warning': '#E0A458',
    '--admin-warning-soft': 'rgba(224,164,88,0.16)',
    '--admin-icon-filter': 'invert(1)',
  },
  light: {
    '--admin-bg': '#F4F6FB',
    '--admin-nav': '#FFFFFF',
    '--admin-surface': '#FFFFFF',
    '--admin-surface2': '#EEF1F8',
    '--admin-border': 'rgba(10,15,44,0.10)',
    '--admin-text': '#0A0F2C',
    '--admin-muted': '#5B6B85',
    '--admin-wordmark': '#3A6EA5',
    '--admin-accent': '#3A6EA5',
    '--admin-accent-soft': 'rgba(58,110,165,0.10)',
    '--admin-shadow': '0 12px 30px rgba(10,15,44,0.08)',
    '--admin-danger': '#C9433F',
    '--admin-danger-hover': '#B53A36',
    '--admin-danger-soft': 'rgba(201,67,63,0.10)',
    '--admin-success': '#3D8B54',
    '--admin-success-soft': 'rgba(61,139,84,0.12)',
    '--admin-warning': '#B5762A',
    '--admin-warning-soft': 'rgba(181,118,42,0.12)',
    '--admin-icon-filter': 'none',
  },
}

function applyAdminTheme(theme) {
  const vars = THEMES[theme] ?? THEMES.dark
  const root = document.documentElement
  for (const key in vars) {
    root.style.setProperty(key, vars[key])
  }
}

export function AdminThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem(STORAGE_KEY) || 'dark'
  })

  useEffect(() => {
    applyAdminTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <AdminThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </AdminThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminTheme() {
  const ctx = useContext(AdminThemeContext)
  if (!ctx) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return ctx
}