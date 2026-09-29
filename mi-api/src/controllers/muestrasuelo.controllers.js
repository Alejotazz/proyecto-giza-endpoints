const modelo = require('../models/muestrasuelo.models');

async function listarMuestrasSuelo(req, res) {
  try {
    const muestras = await modelo.obtenerMuestrasPorTerreno(req.params.id);
    res.json(muestras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearMuestraSuelo(req, res) {
  try {
    const nuevaMuestra = await modelo.crearMuestraSuelo(req.params.id, req.body);
    res.status(201).json(nuevaMuestra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { listarMuestrasSuelo, crearMuestraSuelo };
