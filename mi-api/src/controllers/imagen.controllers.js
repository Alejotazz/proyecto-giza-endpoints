const modelo = require('../models/imagen.models');

async function listarImagenes(req, res, next) {
  try {
    const imagenes = await modelo.obtenerImagenesPorTerreno(req.params.id);
    res.json(imagenes);
  } catch (error) {
    next(error);
  }
}

async function crearImagen(req, res, next) {
  try {
    const nuevaImagen = await modelo.crearImagen(req.params.id, req.body);
    res.status(201).json(nuevaImagen);
  } catch (error) {
    next(error);
  }
}

async function etiquetarImagen(req, res, next) {
  try {
    const imagenActualizada = await modelo.actualizarImagen(req.params.id, req.body);
    res.json(imagenActualizada);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarImagenes, crearImagen, etiquetarImagen };
