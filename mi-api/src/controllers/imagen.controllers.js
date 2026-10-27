const modelo = require('../models/imagen.models');

async function listarImagenes(req, res) {
  try {
    const imagenes = await modelo.obtenerImagenesPorTerreno(req.params.id);
    res.json(imagenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearImagen(req, res) {
  try {
    const nuevaImagen = await modelo.crearImagen(req.params.id, req.body);
    res.status(201).json(nuevaImagen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function etiquetarImagen(req, res) {
  try {
    const imagenActualizada = await modelo.actualizarImagen(req.params.id, req.body);
    res.json(imagenActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { listarImagenes, crearImagen, etiquetarImagen };
