const bcrypt = require('bcryptjs');
const usuariosModel = require('../models/usuarios.models');
const { validarId } = require('../utils/validar');
const { HttpError, noEncontrado, peticionInvalida } = require('../utils/errores');
const { validarCorreo, validarPassword, validarTexto, validarRol } = require('../utils/usuarios.validacion');
const { esAdmin } = require('../middleware/acceso.middleware');

// Los errores de estas funciones async los responde error.middleware.js (Express 5)

async function asegurarCorreoLibre(correo, idUsuarioActual) {
  const otro = await usuariosModel.getUsuarioByCorreo(correo);
  if (otro && String(otro.id_usuario) !== String(idUsuarioActual)) {
    throw new HttpError(409, 'El correo ya está registrado');
  }
}

async function listUsuarios(req, res) {
  res.json(await usuariosModel.getAllUsuarios(req.query));
}

async function getUsuario(req, res) {
  const usuario = await usuariosModel.getUsuarioById(validarId(req.params.id));
  if (!usuario) throw noEncontrado('Usuario');
  res.json(usuario);
}

async function createUsuario(req, res) {
  const body = req.body || {};
  const nombre = validarTexto(body.nombre, 'nombre', { requerido: true });
  const correo = validarCorreo(body.correo);
  const password = validarPassword(body.password);
  const telefono = validarTexto(body.telefono, 'telefono', { maxLargo: 30 });
  const rol = body.rol === undefined ? undefined : validarRol(body.rol);

  await asegurarCorreoLibre(correo);
  const hash = await bcrypt.hash(password, 10);
  const nuevoUsuario = await usuariosModel.createUsuario({ nombre, correo, password: hash, telefono, rol });
  res.status(201).json(nuevoUsuario);
}

async function updateUsuario(req, res) {
  const id = validarId(req.params.id);
  const usuarioExistente = await usuariosModel.getUsuarioById(id);
  if (!usuarioExistente) throw noEncontrado('Usuario');

  const body = req.body || {};
  if (body.rol !== undefined && !esAdmin(req)) {
    throw new HttpError(403, 'Solo un administrador puede cambiar roles');
  }

  // Los campos no enviados conservan su valor
  const datos = {
    nombre: body.nombre !== undefined ? validarTexto(body.nombre, 'nombre', { requerido: true }) : usuarioExistente.nombre,
    correo: body.correo !== undefined ? validarCorreo(body.correo) : usuarioExistente.correo,
    telefono: body.telefono !== undefined ? validarTexto(body.telefono, 'telefono', { maxLargo: 30 }) : usuarioExistente.telefono,
    rol: body.rol !== undefined ? validarRol(body.rol) : usuarioExistente.rol,
  };

  // Un admin no puede quitarse a sí mismo el rol de admin (evita quedarse sin administradores)
  if (String(id) === String(req.usuario.id_usuario) && datos.rol !== usuarioExistente.rol) {
    throw peticionInvalida('No puedes cambiar tu propio rol');
  }

  if (datos.correo !== usuarioExistente.correo) await asegurarCorreoLibre(datos.correo, id);

  res.json(await usuariosModel.updateUsuario(id, datos));
}

async function deleteUsuario(req, res) {
  const id = validarId(req.params.id);
  if (String(id) === String(req.usuario.id_usuario)) {
    throw peticionInvalida('No puedes eliminar tu propia cuenta');
  }
  const eliminado = await usuariosModel.deleteUsuario(id);
  if (!eliminado) throw noEncontrado('Usuario');
  res.json({ mensaje: 'Usuario eliminado correctamente' });
}

// ---------- CULTIVOS ----------

async function listCultivos(req, res) {
  res.json(await usuariosModel.getAllCultivos(req.query));
}

async function getCultivo(req, res) {
  const cultivo = await usuariosModel.getCultivoById(validarId(req.params.id));
  if (!cultivo) throw noEncontrado('Cultivo');
  res.json(cultivo);
}

async function createCultivo(req, res) {
  const nombre_cultivo = validarTexto((req.body || {}).nombre_cultivo, 'nombre_cultivo', { requerido: true, maxLargo: 100 });
  try {
    res.status(201).json(await usuariosModel.createCultivo({ nombre_cultivo }));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Ese cultivo ya existe');
    throw error;
  }
}

async function updateCultivo(req, res) {
  const id = validarId(req.params.id);
  if (!(await usuariosModel.getCultivoById(id))) throw noEncontrado('Cultivo');
  const nombre_cultivo = validarTexto((req.body || {}).nombre_cultivo, 'nombre_cultivo', { requerido: true, maxLargo: 100 });
  try {
    res.json(await usuariosModel.updateCultivo(id, { nombre_cultivo }));
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Ese cultivo ya existe');
    throw error;
  }
}

async function deleteCultivo(req, res) {
  let eliminado;
  try {
    eliminado = await usuariosModel.deleteCultivo(validarId(req.params.id));
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new HttpError(409, 'No se puede eliminar: hay terrenos que usan este cultivo');
    }
    throw error;
  }
  if (!eliminado) throw noEncontrado('Cultivo');
  res.json({ mensaje: 'Cultivo eliminado correctamente' });
}

// ---------- TERRENOS_USUARIOS ----------

async function listUsuariosDeTerreno(req, res) {
  // req.idTerreno lo pone verificarAccesoTerreno (ver usuarios.routes.js)
  res.json(await usuariosModel.getUsuariosByTerreno(req.idTerreno));
}

async function asignarUsuarioATerreno(req, res) {
  const body = req.body || {};
  const idUsuario = validarId(body.id_usuario, 'id_usuario');
  const rol = validarTexto(body.rol, 'rol', { maxLargo: 50 });
  if (!(await usuariosModel.getUsuarioById(idUsuario))) throw noEncontrado('Usuario');
  const relacion = await usuariosModel.asignarUsuarioATerreno(req.idTerreno, idUsuario, rol);
  res.status(201).json(relacion);
}

async function quitarUsuarioDeTerreno(req, res) {
  const idUsuario = validarId(req.params.id_usuario, 'id_usuario');
  const eliminado = await usuariosModel.quitarUsuarioDeTerreno(req.idTerreno, idUsuario);
  if (!eliminado) throw noEncontrado('Relación');
  res.json({ mensaje: 'Usuario removido del terreno correctamente' });
}

module.exports = {
  listUsuarios,
  getUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  listCultivos,
  getCultivo,
  createCultivo,
  updateCultivo,
  deleteCultivo,
  listUsuariosDeTerreno,
  asignarUsuarioATerreno,
  quitarUsuarioDeTerreno,
};
