import api from '../api/axios';

export const registrar = (datos) => api.post('/auth/registro', datos).then((r) => r.data); // { nombre, correo, password, telefono? }
export const iniciarSesion = (correo, password) =>
  api.post('/auth/login', { correo, password }).then((r) => r.data); // { usuario, token }
export const obtenerPerfil = () => api.get('/auth/perfil').then((r) => r.data);
export const actualizarPerfil = (id_usuario, datos) =>
  api.put(`/usuarios/${id_usuario}`, datos).then((r) => r.data); // { nombre?, correo? }
