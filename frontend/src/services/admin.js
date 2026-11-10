import api from '../api/axios';

const datos = (r) => r.data;

export const listarUsuarios = () => api.get('/usuarios').then(datos);
export const cambiarRol = (id, rol) => api.put(`/usuarios/${id}`, { rol }).then(datos);
export const eliminarUsuario = (id) => api.delete(`/usuarios/${id}`).then(datos);

export const listarTerrenos = () => api.get('/terrenos').then(datos);
export const crearTerreno = (terreno) => api.post('/terrenos', terreno).then(datos);
export const listarCultivos = () => api.get('/cultivos').then(datos);
export const crearCultivo = (nombre_cultivo) => api.post('/cultivos', { nombre_cultivo }).then(datos);

export const usuariosDeTerreno = (idTerreno) => api.get(`/terrenos/${idTerreno}/usuarios`).then(datos);
export const asignarTerreno = (idTerreno, id_usuario, rol_relacion) =>
  api.post(`/terrenos/${idTerreno}/usuarios`, { id_usuario, rol_relacion }).then(datos);
export const quitarTerreno = (idTerreno, idUsuario) =>
  api.delete(`/terrenos/${idTerreno}/usuarios/${idUsuario}`).then(datos);

// Texto para mostrar a partir de un error de la API
export function mensajeError(err, porDefecto = 'No se pudo completar la acción') {
  if (!err.response) return 'No se pudo conectar con el servidor';
  const { mensaje, errores } = err.response.data || {};
  const lista = Array.isArray(errores) ? errores : Object.values(errores || {});
  return `${mensaje || porDefecto}${lista.length ? `: ${lista.join(', ')}` : ''}`;
}
