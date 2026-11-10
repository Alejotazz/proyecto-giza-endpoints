import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SinAcceso() {
  return (
    <div className="app-center">
      <div>
        <h2>No tienes acceso a esta sección</h2>
        <p>Tu cuenta no tiene permiso para ver esta página.</p>
        <Link to="/dashboard" className="g-btn g-btn--primary">Volver al Panel</Link>
      </div>
    </div>
  );
}

// Exige sesión iniciada; con "roles", además exige uno de esos roles.
// Esto solo decide qué pantalla se muestra: los permisos reales los valida la API.
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="giza"><div className="app-center"><span className="spinner" /></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) return <SinAcceso />;
  return <Outlet />;
}
