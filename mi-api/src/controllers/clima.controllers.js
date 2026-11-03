const modelo = require('../models/clima.models');
const { validar } = require('../utils/validar');
const { peticionInvalida } = require('../utils/errores');

async function listarClima(req, res) {
  res.json(await modelo.obtenerClimaPorTerreno(req.idTerreno, req.query));
}

async function crearDatoClima(req, res) {
  const datos = validar(modelo.esquema, req.body);
  if (datos.temp_min != null && datos.temp_max != null && datos.temp_min > datos.temp_max) {
    throw peticionInvalida('temp_min no puede ser mayor que temp_max');
  }
  res.status(201).json(await modelo.crearDatoClima(req.idTerreno, datos));
}

module.exports = { listarClima, crearDatoClima };
