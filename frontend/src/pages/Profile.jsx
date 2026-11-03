import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Mi perfil</h1>
      <p><b>ID:</b> {user.id_usuario}</p>
      <p><b>Nombre:</b> {user.nombre}</p>
      <p><b>Correo:</b> {user.correo}</p>
      <p><b>Rol:</b> {user.rol}</p>
      <Link to="/perfil/editar">Editar perfil</Link>
    </div>
  );
}