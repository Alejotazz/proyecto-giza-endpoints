import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrar } from '../services/auth';
import AuthLayout, { AuthTabs, RoleSelector, Field, PasswordField } from '../components/AuthLayout';
import { ROLES_REGISTRO } from '../utils/roles';

function Hero() {
  return (
    <>
      <div className="giza-eyebrow">🌱 Giza · Únete hoy</div>
      <h1 className="giza-title">Empieza a<br /><em>predecir</em><br />tu cosecha</h1>
      <p className="giza-lead">
        Crea tu cuenta gratis y accede al sistema de IA más avanzado para cultivos de Arroz y Café en Latinoamérica.
      </p>
      <ul className="giza-checks">
        <li>14 días gratis sin tarjeta de crédito</li>
        <li>Hasta 3 parcelas en el plan gratuito</li>
        <li>Soporte por WhatsApp incluido</li>
        <li>Modelo IA actualizado cada temporada</li>
      </ul>
      <div className="giza-box">
        <div className="giza-box__label">Cultivos soportados</div>
        <div className="giza-chips">
          <span className="giza-chip giza-chip--arroz">🌾 Arroz</span>
          <span className="giza-chip giza-chip--cafe">☕ Café</span>
        </div>
      </div>
    </>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', password: '' });
  const [tipo, setTipo] = useState('agricultor');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrar({
        nombre: `${form.nombre} ${form.apellido}`.trim(),
        correo: form.correo,
        password: form.password,
        tipo_usuario: tipo,
      });
      navigate('/login', { state: { registrado: true } });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthLayout hero={<Hero />}>
      <form className="giza-form" onSubmit={onSubmit}>
        <h2>Crear cuenta</h2>
        <p className="sub">Completa tu información para comenzar</p>
        <AuthTabs />

        <div className="g-row">
          <Field label="Nombre" icon="👤" name="nombre" value={form.nombre} onChange={onChange}
            placeholder="Juan" autoComplete="given-name" required />
          <Field label="Apellido" icon="👤" name="apellido" value={form.apellido} onChange={onChange}
            placeholder="Méndez" autoComplete="family-name" />
        </div>
        <Field label="Correo electrónico" icon="✉️" name="correo" type="email" value={form.correo}
          onChange={onChange} placeholder="tu@correo.com" autoComplete="email" required />
        <PasswordField label="Contraseña" name="password" value={form.password} onChange={onChange}
          placeholder="Mínimo 8 caracteres" minLength={8} autoComplete="new-password" required />

        <span className="g-label">Tipo de usuario</span>
        <RoleSelector roles={ROLES_REGISTRO} value={tipo} onChange={setTipo} />

        {error && <div className="g-alert g-alert--error">{error}</div>}

        <button type="submit" className="g-btn g-btn--primary g-btn--block" disabled={cargando}>
          {cargando ? 'Creando cuenta…' : '🌱 Crear mi cuenta gratis'}
        </button>

        <p className="g-foot">
          Al registrarte aceptas los <b>Términos de servicio</b><br />
          ¿Ya tienes cuenta? <Link className="g-link" to="/login">Iniciar sesión</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
