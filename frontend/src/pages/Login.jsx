import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthTabs, RoleSelector, Field, PasswordField } from '../components/AuthLayout';

// Selector solo visual: el rol real lo define el backend (usuario.rol)
const ROLES = [
  { id: 'agricultor', label: 'Agricultor', icon: '👨‍🌾' },
  { id: 'agronomo', label: 'Agrónomo', icon: '🔬' },
  { id: 'investigador', label: 'Investigador', icon: '📊' },
  { id: 'administrador', label: 'Administrador', icon: '⚙️' },
];

function Hero() {
  return (
    <>
      <div className="giza-eyebrow">🌱 Giza · Plataforma IA</div>
      <h1 className="giza-title">Bienvenido<br />de <em>vuelta</em></h1>
      <p className="giza-lead">
        Accede a tu panel de predicciones, alertas de cultivo y reportes generados por inteligencia artificial.
      </p>

      <div className="giza-box">
        <p className="giza-quote">
          “Giza me ayudó a detectar roya en mi cafetal 3 semanas antes de que fuera visible. Salvé el 40% de mi cosecha.”
        </p>
        <div className="giza-author">
          <span className="giza-avatar">CM</span>
          <div>
            <b>Carlos Muñoz</b>
            <small>Caficultor · Huila, Colombia</small>
          </div>
        </div>
      </div>

      <div className="giza-stats">
        <div className="giza-stat"><b className="c-lime">91%</b><small>Precisión</small></div>
        <div className="giza-stat"><b className="c-teal">24</b><small>Parcelas activas</small></div>
        <div className="giza-stat"><b className="c-amber">3</b><small>Alertas hoy</small></div>
      </div>
    </>
  );
}

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const recienRegistrado = useLocation().state?.registrado;
  const [form, setForm] = useState({ correo: '', password: '' });
  const [rol, setRol] = useState('agricultor');
  const [recordar, setRecordar] = useState(true);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await login(form.correo, form.password, recordar);
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout hero={<Hero />}>
      <form className="giza-form" onSubmit={onSubmit}>
        <h2>Iniciar sesión</h2>
        <p className="sub">Ingresa tus credenciales para continuar</p>
        <AuthTabs />

        <RoleSelector roles={ROLES} value={rol} onChange={setRol} />

        <Field label="Correo electrónico" icon="✉️" name="correo" type="email" value={form.correo}
          onChange={onChange} placeholder="juan.mendez@giza.co" autoComplete="email" required />
        <PasswordField label="Contraseña" name="password" value={form.password} onChange={onChange}
          placeholder="••••••••" autoComplete="current-password" required />

        <div className="g-between">
          <label className="g-check">
            <input type="checkbox" checked={recordar} onChange={(e) => setRecordar(e.target.checked)} />
            Recordar sesión
          </label>
          <a className="g-link" href="#" onClick={(e) => e.preventDefault()} title="Próximamente">¿Olvidaste tu contraseña?</a>
        </div>

        {recienRegistrado && !error && <div className="g-alert g-alert--ok">Cuenta creada. Ya puedes iniciar sesión.</div>}
        {error && <div className="g-alert g-alert--error">{error}</div>}

        <button type="submit" className="g-btn g-btn--primary g-btn--block" disabled={cargando}>
          {cargando ? 'Ingresando…' : '🚀 Ingresar al sistema'}
        </button>

        <div className="g-divider">o continúa con</div>
        <div className="g-social">
          <button type="button" disabled title="Próximamente">🌐 Google</button>
          <button type="button" disabled title="Próximamente">🪟 Microsoft</button>
        </div>

        <p className="g-foot">¿No tienes cuenta? <Link className="g-link" to="/register">Regístrate</Link></p>
      </form>
    </AuthLayout>
  );
}
