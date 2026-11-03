import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

export default function App() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Login y Registro tienen su propia pantalla completa (barra, hero y formulario)
  if (pathname === '/login' || pathname === '/register') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  return (
    <>
      <nav style={{ display: 'flex', gap: 16, padding: 16 }}>
        {user ? (
          <>
            <Link to="/perfil">Mi perfil</Link>
            <button onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Ingresar</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/perfil" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/editar" element={<EditProfile />} />
            {/* aquí van también las rutas protegidas del CRUD de productos */}
          </Route>
          <Route path="*" element={<p>Página no encontrada</p>} />
        </Routes>
      </main>
    </>
  );
}