import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function PrivateRoute({ children, adminOnly = false }) {
    const { isAuthenticated, isAdmin } = useAuth()

    if (!isAuthenticated()) {
        // Admin back-office → /login (separate page, stays unchanged)
        // User-facing protected routes (profil, etc.) → /connexion
        return <Navigate to={adminOnly ? '/login' : '/connexion'} />
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" />
    }

    return children
}

export default PrivateRoute