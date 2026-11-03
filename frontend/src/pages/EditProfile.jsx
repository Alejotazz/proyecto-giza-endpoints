import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil, obtenerPerfil } from '../services/auth';
import { Field } from '../components/AuthLayout';
import { iniciales } from '../components/AppLayout';

// Convierte la respuesta de error de la API en un texto para mostrar
function mensajeDeError(err) {
  const { status, data } = err.response || {};
  if (status === 409) return 'Ese correo ya está registrado';
  if (!err.response) return 'No se pudo conectar con el servidor';
  let msg = data?.mensaje || 'No se pudo actualizar el perfil';
  if (status === 400 && data?.errores) {
    const lista = Array.isArray(data.errores) ? data.errores : Object.values(data.errores);
    if (lista.length) msg += `: ${lista.join(', ')}`;
  }
  return msg;
}

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: user.nombre || '', correo: user.correo || '', telefono: user.telefono || '' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await actualizarPerfil(user.id_usuario, {
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        telefono: form.telefono.trim(),
      });
      setUser(await obtenerPerfil()); // refresca los datos (la barra muestra el nombre nuevo)
      navigate('/perfil', { state: { guardado: true } });
    } catch (err) {
      setError(mensajeDeError(err));
      setGuardando(false);
    }
  };

  return (
    <div className="edit-wrap">
      <Link to="/perfil" className="back">← Volver a mi perfil</Link>

      <form className="app-card giza-form" onSubmit={onSubmit}>
        <div className="edit-head">
          <span className="prof-avatar">{iniciales(form.nombre || user.nombre)}</span>
          <div>
            <h2>Editar perfil</h2>
            <p>Actualiza tu información personal</p>
          </div>
        </div>

        <Field label="Nombre" icon="👤" name="nombre" value={form.nombre} onChange={onChange}
          placeholder="Juan Méndez" autoComplete="name" maxLength={150} required />
        <Field label="Correo electrónico" icon="✉️" name="correo" type="email" value={form.correo}
          onChange={onChange} placeholder="tu@correo.com" autoComplete="email" required />
        <Field label="Teléfono (opcional)" icon="📱" name="telefono" type="tel" value={form.telefono}
          onChange={onChange} placeholder="+57 300 000 0000" autoComplete="tel" maxLength={30} />

        <div className="g-field">
          <span className="g-label">Rol</span>
          <div className="g-input">
            <span className="ico">🔒</span>
            <input value={user.rol} disabled style={{ textTransform: 'capitalize', opacity: 0.7 }} />
          </div>
        </div>
        <p className="g-hint">El rol solo lo puede cambiar un administrador.</p>

        {error && <div className="g-alert g-alert--error">{error}</div>}

        <div className="edit-actions">
          <Link to="/perfil" className="g-btn g-btn--ghost">Cancelar</Link>
          <button type="submit" className="g-btn g-btn--primary" disabled={guardando}>
            {guardando ? 'Guardando…' : '💾 Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
