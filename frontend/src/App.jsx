import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import Accueil from './user/pages/public/Accueil'
import FilmDetail from './user/pages/public/FilmDetail'
import Auth from './user/pages/public/Auth'
import Profile from './user/pages/public/Profile'
import Seances from './user/pages/public/Seances'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import Rooms from './pages/admin/Rooms'
import PrivateRoute from './components/PrivateRoute'
import FilmsList from './pages/admin/films/FilmsList'
import FilmCreate from './pages/admin/films/FilmCreate'
import FilmEdit from './pages/admin/films/FilmEdit'
import ScreeningsList from './pages/admin/screenings/ScreeningsList'
import ScreeningCreate from './pages/admin/screenings/ScreeningCreate'
import ScreeningEdit from './pages/admin/screenings/ScreeningEdit'
import BookingsList from './pages/admin/BookingsList'
import FilmShow from './pages/admin/films/FilmShow'
import AdminProfile from './pages/admin/AdminProfile'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Accueil />} />

        <Route path="/films/:id" element={<FilmDetail />} />

        <Route path="/seances" element={<Seances />} />

        <Route path="/connexion" element={<Auth initialMode="login" />} />
        <Route path="/inscription" element={<Auth initialMode="register" />} />

        <Route path="/profil" element={<PrivateRoute><Profile /></PrivateRoute>} />

        

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/admin" element={
          <PrivateRoute adminOnly={true}><Dashboard /></PrivateRoute>
        } />

        <Route path="/admin/categories" element={
          <PrivateRoute adminOnly={true}><Categories /></PrivateRoute>
        } />

        <Route path="/admin/rooms" element={
          <PrivateRoute adminOnly={true}><Rooms /></PrivateRoute>
        } />

        <Route path="/admin/films" element={
          <PrivateRoute adminOnly={true}><FilmsList /></PrivateRoute>
        } />

        <Route path="/admin/films/create" element={
          <PrivateRoute adminOnly={true}><FilmCreate /></PrivateRoute>
        } />

        <Route path="/admin/films/:id/edit" element={
          <PrivateRoute adminOnly={true}><FilmEdit /></PrivateRoute>
        } />

        <Route path="/admin/screenings" element={
          <PrivateRoute adminOnly={true}><ScreeningsList /></PrivateRoute>
        } />

        <Route path="/admin/screenings/create" element={
          <PrivateRoute adminOnly={true}><ScreeningCreate /></PrivateRoute>
        } />

        <Route path="/admin/screenings/:id/edit" element={
          <PrivateRoute adminOnly={true}><ScreeningEdit /></PrivateRoute>
        } />

        <Route path="/admin/bookings" element={
          <PrivateRoute adminOnly={true}><BookingsList /></PrivateRoute>
        } />

        <Route path="/admin/films/:id" element={
          <PrivateRoute adminOnly={true}><FilmShow /></PrivateRoute>
        } />

        <Route path="/admin/profile" element={
          <PrivateRoute adminOnly={true}><AdminProfile /></PrivateRoute>
        } />


      </Routes>
    </BrowserRouter>
  )
}

export default App