import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import AppLayout from './components/AppLayout';
import './styles/auth.css';
import './styles/app.css';

export default function App() {
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
    <Routes>
      <Route path="/" element={<Navigate to="/perfil" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/editar" element={<EditProfile />} />
          {/* aquí van también las rutas protegidas del CRUD de productos */}
        </Route>
      </Route>
      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  );
}

function NoEncontrada() {
  return (
    <div className="giza">
      <div className="app-center">
        <div>
          <h2>Página no encontrada</h2>
          <p>La dirección que buscas no existe.</p>
          <Link to="/perfil" className="g-btn g-btn--primary">Ir a mi perfil</Link>
        </div>
      </div>
    </div>
  );
}
