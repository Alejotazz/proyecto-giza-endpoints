
const usuariosModel = require('./usuarios.models');

async function listUsuarios(req, res) {
  try {
    const usuarios = await usuariosModel.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
}

async function getUsuario(req, res) {
  try {
    const usuario = await usuariosModel.getUsuarioById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el usuario', error: error.message });
  }
}

async function createUsuario(req, res) {
  try {
    const { nombre, correo, contrasena, rol } = req.body;
    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({ mensaje: 'nombre, correo y contrasena son obligatorios' });
    }
    const nuevoUsuario = await usuariosModel.createUsuario({ nombre, correo, contrasena, rol });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el usuario', error: error.message });
  }
}

async function updateUsuario(req, res) {
  try {
    const usuarioExistente = await usuariosModel.getUsuarioById(req.params.id);
    if (!usuarioExistente) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    const usuarioActualizado = await usuariosModel.updateUsuario(req.params.id, req.body);
    res.json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el usuario', error: error.message });
  }
}

async function deleteUsuario(req, res) {
  try {
    const eliminado = await usuariosModel.deleteUsuario(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error: error.message });
  }
}

// ---------- CULTIVOS ----------

async function listCultivos(req, res) {
  try {
    const cultivos = await usuariosModel.getAllCultivos();
    res.json(cultivos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener cultivos', error: error.message });
  }
}

async function getCultivo(req, res) {
  try {
    const cultivo = await usuariosModel.getCultivoById(req.params.id);
    if (!cultivo) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    res.json(cultivo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el cultivo', error: error.message });
  }
}

async function createCultivo(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) return res.status(400).json({ mensaje: 'nombre es obligatorio' });
    const nuevoCultivo = await usuariosModel.createCultivo({ nombre, descripcion });
    res.status(201).json(nuevoCultivo);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el cultivo', error: error.message });
  }
}

async function updateCultivo(req, res) {
  try {
    const cultivoExistente = await usuariosModel.getCultivoById(req.params.id);
    if (!cultivoExistente) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    const cultivoActualizado = await usuariosModel.updateCultivo(req.params.id, req.body);
    res.json(cultivoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el cultivo', error: error.message });
  }
}

async function deleteCultivo(req, res) {
  try {
    const eliminado = await usuariosModel.deleteCultivo(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Cultivo no encontrado' });
    res.json({ mensaje: 'Cultivo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el cultivo', error: error.message });
  }
}

// ---------- TERRENOS_USUARIOS ----------

async function listUsuariosDeTerreno(req, res) {
  try {
    const usuarios = await usuariosModel.getUsuariosByTerreno(req.params.id);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios del terreno', error: error.message });
  }
}

async function asignarUsuarioATerreno(req, res) {
  try {
    const { id } = req.params; // id_terreno
    const { id_usuario, rol } = req.body;
    if (!id_usuario) return res.status(400).json({ mensaje: 'id_usuario es obligatorio' });
    const relacion = await usuariosModel.asignarUsuarioATerreno(id, id_usuario, rol);
    res.status(201).json(relacion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al asignar usuario al terreno', error: error.message });
  }
}

async function quitarUsuarioDeTerreno(req, res) {
  try {
    const { id, id_usuario } = req.params;
    const eliminado = await usuariosModel.quitarUsuarioDeTerreno(id, id_usuario);
    if (!eliminado) return res.status(404).json({ mensaje: 'Relación no encontrada' });
    res.json({ mensaje: 'Usuario removido del terreno correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al quitar usuario del terreno', error: error.message });
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