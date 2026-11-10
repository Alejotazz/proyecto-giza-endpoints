const { peticionInvalida } = require('./errores');

// Roles de la app. Si se agrega uno nuevo en la BD, agregarlo aquí también.
const ROLES = (process.env.ROLES || 'administrador,agricultor,agronomo,investigador,empresa').split(',').map((r) => r.trim()).filter(Boolean);

// Roles que una persona puede elegir al registrarse. 'administrador' e 'investigador'
// nunca están aquí: dan acceso a datos de todos los terrenos y solo los asigna un admin.
const ROLES_REGISTRO = ['agricultor', 'agronomo', 'empresa'];
const ROL_POR_DEFECTO = 'agricultor';

// Relación de un usuario con un terreno (ENUM terrenos_usuarios.rol_relacion)
const ROLES_RELACION = ['propietario', 'encargado', 'consultor'];
const RELACION_POR_DEFECTO = 'consultor';

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCorreo(correo) {
  if (typeof correo !== 'string' || !CORREO.test(correo.trim()) || correo.length > 254) {
    throw peticionInvalida('correo no tiene un formato válido');
  }
  return correo.trim().toLowerCase();
}

// bcrypt solo usa los primeros 72 bytes, por eso se limita el largo
function validarPassword(password) {
  if (typeof password !== 'string') throw peticionInvalida('password debe ser texto');
  if (password.length < 6) throw peticionInvalida('El password debe tener al menos 6 caracteres');
  if (Buffer.byteLength(password, 'utf8') > 72) throw peticionInvalida('El password no puede tener más de 72 caracteres');
  return password;
}

function validarTexto(valor, campo, { requerido = false, maxLargo = 150 } = {}) {
  if (valor === undefined || valor === null || valor === '') {
    if (requerido) throw peticionInvalida(`${campo} es obligatorio`);
    return valor === '' ? null : valor;
  }
  if (typeof valor !== 'string' && typeof valor !== 'number') throw peticionInvalida(`${campo} debe ser texto`);
  const texto = String(valor).trim();
  if (requerido && !texto) throw peticionInvalida(`${campo} es obligatorio`);
  if (texto.length > maxLargo) throw peticionInvalida(`${campo} no puede tener más de ${maxLargo} caracteres`);
  return texto;
}

function validarRol(rol) {
  if (!ROLES.includes(rol)) throw peticionInvalida(`rol debe ser uno de: ${ROLES.join(', ')}`);
  return rol;
}

// tipo_usuario del registro público: opcional, y nunca puede ser administrador
function validarTipoUsuario(tipo) {
  if (tipo === undefined || tipo === null || tipo === '') return ROL_POR_DEFECTO;
  if (!ROLES_REGISTRO.includes(tipo)) {
    throw peticionInvalida(`tipo_usuario debe ser uno de: ${ROLES_REGISTRO.join(', ')}`);
  }
  return tipo;
}

function validarRolRelacion(rol) {
  if (rol === undefined || rol === null || rol === '') return RELACION_POR_DEFECTO;
  if (!ROLES_RELACION.includes(rol)) {
    throw peticionInvalida(`rol_relacion debe ser uno de: ${ROLES_RELACION.join(', ')}`);
  }
  return rol;
}

module.exports = {
  ROLES, ROLES_REGISTRO, ROLES_RELACION,
  validarCorreo, validarPassword, validarTexto, validarRol, validarTipoUsuario, validarRolRelacion,
};
