import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';
import '../styles/app.css';

export const iniciales = (nombre = '') =>
  nombre.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || '?';

// Estructura de las pantallas internas (usuario con sesión): barra superior + contenido
export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="giza">
      <header className="giza-nav">
        <div className="giza-nav__left">
          <Link to="/perfil" className="giza-logo">
            <img className="giza-logo__icon" src="/giza-emblem.png" alt="Logo Giza" />
            <span>Giza<span className="dot">.</span></span>
          </Link>
          <nav className="giza-links">
            <NavLink to="/perfil" end>Mi perfil</NavLink>
          </nav>
        </div>
        <div className="giza-nav__right">
          {user && (
            <Link to="/perfil" className="app-user">
              <span className="app-user__avatar">{iniciales(user.nombre)}</span>
              <span className="app-user__name">{user.nombre}</span>
            </Link>
          )}
          <button type="button" className="g-btn g-btn--ghost app-logout" onClick={salir}>Cerrar sesión</button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
