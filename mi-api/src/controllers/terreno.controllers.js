const modelo = require('../models/terreno.models');

// Traduce los errores de MySQL a mensajes claros; lo demás pasa al manejador central (500)
function responderErrorBD(error, res, next) {
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ mensaje: 'El cultivo indicado (id_cultivo) no existe' });
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ mensaje: 'No se puede eliminar: el terreno tiene datos asociados' });
  }
  next(error);
}

function validarTerreno(datos) {
  if (!datos.nombre || !datos.id_cultivo) return 'nombre e id_cultivo son obligatorios';
  return null;
}

async function listarTerrenos(req, res, next) {
  try {
    const terrenos = await modelo.obtenerTerrenos();
    res.json(terrenos);
  } catch (error) {
    next(error);
  }
}

async function obtenerTerreno(req, res, next) {
  try {
    const terreno = await modelo.obtenerTerrenoPorId(req.params.id);
    if (!terreno) return res.status(404).json({ mensaje: 'Terreno no encontrado' });
    res.json(terreno);
  } catch (error) {
    next(error);
  }
}

async function crearTerreno(req, res, next) {
  try {
    const invalido = validarTerreno(req.body || {});
    if (invalido) return res.status(400).json({ mensaje: invalido });
    const nuevoTerreno = await modelo.crearTerreno(req.body);
    res.status(201).json(nuevoTerreno);
  } catch (error) {
    responderErrorBD(error, res, next);
  }
}

async function actualizarTerreno(req, res, next) {
  try {
    const invalido = validarTerreno(req.body || {});
    if (invalido) return res.status(400).json({ mensaje: invalido });
    const existente = await modelo.obtenerTerrenoPorId(req.params.id);
    if (!existente) return res.status(404).json({ mensaje: 'Terreno no encontrado' });
    const terrenoActualizado = await modelo.actualizarTerreno(req.params.id, req.body);
    res.json(terrenoActualizado);
  } catch (error) {
    responderErrorBD(error, res, next);
  }
}

async function eliminarTerreno(req, res, next) {
  try {
    const eliminado = await modelo.eliminarTerreno(req.params.id);
    if (!eliminado) return res.status(404).json({ mensaje: 'Terreno no encontrado' });
    res.json({ mensaje: 'Terreno eliminado correctamente' });
  } catch (error) {
    responderErrorBD(error, res, next);
  }
}

module.exports = { listarTerrenos, obtenerTerreno, crearTerreno, actualizarTerreno, eliminarTerreno };
