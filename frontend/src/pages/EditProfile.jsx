import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { actualizarPerfil, obtenerPerfil } from '../services/auth';

export default function EditProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: user.nombre, correo: user.correo });
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await actualizarPerfil(user.id_usuario, form);
      setUser(await obtenerPerfil()); // refresca los datos mostrados
      navigate('/perfil');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo actualizar');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Editar perfil</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><input name="nombre" value={form.nombre} onChange={onChange} placeholder="Nombre" required /></p>
      <p><input name="correo" type="email" value={form.correo} onChange={onChange} placeholder="Correo" required /></p>
      <button type="submit">Guardar cambios</button>{' '}
      <button type="button" onClick={() => navigate('/perfil')}>Cancelar</button>
    </form>
  );
}