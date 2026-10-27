const bcrypt = require('bcryptjs');
const usuariosModel = require('../models/usuarios.models');

async function listUsuarios(req, res, next) {
  try {
    const usuarios = await usuariosModel.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function getUsuario(req, res, next) {
  try {
    const usuario = await usuariosModel.getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function createUsuario(req, res, next) {
  try {
    const { nombre, correo, password, telefono, rol } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'nombre, correo y password son obligatorios' });
    }
    const hash = await bcrypt.hash(password, 10);
    const nuevoUsuario = await usuariosModel.createUsuario({ nombre, correo, password: hash, telefono, rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    next(error);
  }
}

async function updateUsuario(req, res, next) {
  try {
    const usuarioExistente = await usuariosModel.getUsuarioById(req.params.id);
    if (!usuarioExistente) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    const { nombre, correo, rol } = req.body;
    // Solo un admin puede cambiar roles; los campos no enviados conservan su valor
    const datos = {
      nombre: nombre ?? usuarioExistente.nombre,
      correo: correo ?? usuarioExistente.correo,
      rol: req.usuario.rol === 'administrador' && rol ? rol : usuarioExistente.rol,
    };
    const usuarioActualizado = await usuariosModel.updateUsuario(req.params.id, datos);
    res.json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
}

async function deleteUsuario(req, res, next) {
  try {
    const eliminado = await usuariosModel.deleteUsuario(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

// ---------- CULTIVOS ----------

async function listCultivos(req, res, next) {
  try {
    const cultivos = await usuariosModel.getAllCultivos();
    res.json(cultivos);
  } catch (error) {
    next(error);
  }
}

async function getCultivo(req, res, next) {
  try {
    const cultivo = await usuariosModel.getCultivoById(req.params.id);
    if (!cultivo) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    res.json(cultivo);
  } catch (error) {
    next(error);
  }
}

async function createCultivo(req, res, next) {
  try {
    const { nombre_cultivo } = req.body;
    if (!nombre_cultivo) return res.status(400).json({ mensaje: 'nombre_cultivo es obligatorio' });
    const nuevoCultivo = await usuariosModel.createCultivo({ nombre_cultivo });
    res.status(201).json(nuevoCultivo);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ese cultivo ya existe' });
    next(error);
  }
}

async function updateCultivo(req, res, next) {
  try {
    const { nombre_cultivo } = req.body;
    if (!nombre_cultivo) return res.status(400).json({ mensaje: 'nombre_cultivo es obligatorio' });
    const cultivoExistente = await usuariosModel.getCultivoById(req.params.id);
    if (!cultivoExistente) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    const cultivoActualizado = await usuariosModel.updateCultivo(req.params.id, { nombre_cultivo });
    res.json(cultivoActualizado);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ mensaje: 'Ese cultivo ya existe' });
    next(error);
  }
}

async function deleteCultivo(req, res, next) {
  try {
    const eliminado = await usuariosModel.deleteCultivo(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    res.json({ mensaje: 'Cultivo eliminado correctamente' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({ mensaje: 'No se puede eliminar: hay terrenos que usan este cultivo' });
    }
    next(error);
  }
}

// ---------- TERRENOS_USUARIOS ----------

async function listUsuariosDeTerreno(req, res, next) {
  try {
    const usuarios = await usuariosModel.getUsuariosByTerreno(req.params.id);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function asignarUsuarioATerreno(req, res, next) {
  try {
    const { id } = req.params; // id_terreno
    const { id_usuario, rol } = req.body;
    if (!id_usuario) return res.status(400).json({ mensaje: 'id_usuario es obligatorio' });
    const relacion = await usuariosModel.asignarUsuarioATerreno(id, id_usuario, rol);
    res.status(201).json(relacion);
  } catch (error) {
    next(error);
  }
}

async function quitarUsuarioDeTerreno(req, res, next) {
  try {
    const { id, id_usuario } = req.params;
    const eliminado = await usuariosModel.quitarUsuarioDeTerreno(id, id_usuario);
    if (!eliminado) return res.status(404).json({ mensaje: 'Relación no encontrada' });
    res.json({ mensaje: 'Usuario removido del terreno correctamente' });
  } catch (error) {
    next(error);
  }
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