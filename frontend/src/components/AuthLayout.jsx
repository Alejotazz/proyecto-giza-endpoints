import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/auth.css';

// Estructura común de Login y Registro: barra superior + columna izquierda (hero) + panel derecho (formulario)
export default function AuthLayout({ hero, children }) {
  return (
    <div className="giza">
      <header className="giza-nav">
        <div className="giza-nav__left">
          <Link to="/" className="giza-logo">
            <img className="giza-logo__icon" src="/giza-emblem.png" alt="Logo Giza" />
            <span>Giza<span className="dot">.</span></span>
          </Link>
          <nav className="giza-links">
            <a href="#inicio">Inicio</a>
            <a href="#precios">Precios</a>
            <NavLink to="/login">Ingresar</NavLink>
          </nav>
        </div>
        <div className="giza-nav__right">
          <Link to="/login" className="g-btn g-btn--ghost">Iniciar sesión</Link>
          <Link to="/register" className="g-btn g-btn--primary">Comenzar gratis</Link>
        </div>
      </header>

      <main className="giza-main">
        <section className="giza-hero">{hero}</section>
        <aside className="giza-side">{children}</aside>
      </main>
    </div>
  );
}

export function AuthTabs() {
  return (
    <div className="giza-tabs">
      <NavLink to="/login">Iniciar sesión</NavLink>
      <NavLink to="/register">Registrarse</NavLink>
    </div>
  );
}

export function RoleSelector({ roles, value, onChange }) {
  return (
    <div className="g-roles">
      {roles.map((r) => (
        <button
          type="button"
          key={r.id}
          className={`g-role${value === r.id ? ' active' : ''}`}
          onClick={() => onChange(r.id)}
        >
          <span className="emoji">{r.icon}</span>
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, icon, type = 'text', ...props }) {
  return (
    <div className="g-field">
      <label htmlFor={props.name}>{label}</label>
      <div className="g-input">
        <span className="ico">{icon}</span>
        <input id={props.name} type={type} {...props} />
      </div>
    </div>
  );
}

export function PasswordField({ label, ...props }) {
  return (
    <div className="g-field">
      <label htmlFor={props.name}>{label}</label>
      <PasswordInput {...props} />
    </div>
  );
}

function PasswordInput(props) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="g-input">
      <span className="ico">🔒</span>
      <input id={props.name} type={visible ? 'text' : 'password'} {...props} />
      <button
        type="button"
        className="g-eye"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      >
        {visible ? '🙈' : '👁'}
      </button>
    </div>
  );
}
