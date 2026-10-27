const modelo = require('../models/clima.models');

async function listarClima(req, res, next) {
  try {
    const clima = await modelo.obtenerClimaPorTerreno(req.params.id);
    res.json(clima);
  } catch (error) {
    next(error);
  }
}

async function crearDatoClima(req, res, next) {
  try {
    const nuevoDato = await modelo.crearDatoClima(req.params.id, req.body);
    res.status(201).json(nuevoDato);
  } catch (error) {
    next(error);
  }
}

module.exports = { listarClima, crearDatoClima };
