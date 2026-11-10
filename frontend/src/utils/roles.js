// Roles de la aplicación: los id son los mismos que usa la base de datos
export const ROL_ADMIN = 'administrador';
export const ROL_INVESTIGADOR = 'investigador';

export const ROLES = [
  { id: 'administrador', label: 'Administrador', icon: '⚙️' },
  { id: 'agricultor', label: 'Agricultor', icon: '👨‍🌾' },
  { id: 'agronomo', label: 'Agrónomo', icon: '🔬' },
  { id: 'investigador', label: 'Investigador', icon: '📊' },
  { id: 'empresa', label: 'Empresa', icon: '🏢' },
];

// Los que una persona puede elegir al registrarse. Administrador e Investigador
// solo los asigna un administrador desde la pantalla Usuarios.
export const ROLES_REGISTRO = ROLES.filter((r) => r.id !== ROL_ADMIN && r.id !== ROL_INVESTIGADOR);

// Relación de un usuario con un terreno
export const RELACIONES = [
  { id: 'propietario', label: 'Propietario' },
  { id: 'encargado', label: 'Encargado' },
  { id: 'consultor', label: 'Consultor' },
];
export const RELACION_POR_DEFECTO = 'consultor';

const buscar = (id) => ROLES.find((r) => r.id === id);
export const etiquetaRol = (id) => buscar(id)?.label ?? id;
export const iconoRol = (id) => buscar(id)?.icon ?? '👤';
export const etiquetaRelacion = (id) => RELACIONES.find((r) => r.id === id)?.label ?? id ?? '—';
