const modelo = require('../models/clima.models');

async function listarClima(req, res) {
  try {
    const clima = await modelo.obtenerClimaPorTerreno(req.params.id);
    res.json(clima);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearDatoClima(req, res) {
  try {
    const nuevoDato = await modelo.crearDatoClima(req.params.id, req.body);
    res.status(201).json(nuevoDato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { listarClima, crearDatoClima };
