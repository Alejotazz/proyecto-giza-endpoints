const modelo = require('../models/muestrasuelo.models');

async function listarMuestrasSuelo(req, res, next) {
  try {
    const muestras = await modelo.obtenerMuestrasPorTerreno(req.params.id);
    res.json(muestras);
  } catch (error) {
    next(error);
  }
}

async function crearMuestraSuelo(req, res, next) {
  try {
    const nuevaMuestra = await modelo.crearMuestraSuelo(req.params.id, req.body);
    res.status(201).json(nuevaMuestra);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarMuestrasSuelo, crearMuestraSuelo };
