const modelo = require('../models/muestrasuelo.models');
const { validar } = require('../utils/validar');
const { peticionInvalida } = require('../utils/errores');

async function listarMuestrasSuelo(req, res) {
  res.json(await modelo.obtenerMuestrasPorTerreno(req.idTerreno, req.query));
}

async function crearMuestraSuelo(req, res) {
  const datos = validar(modelo.esquema, req.body);
  const textura = (datos.arcilla_pct || 0) + (datos.arena_pct || 0) + (datos.limo_pct || 0);
  if (textura > 100.5) throw peticionInvalida('arcilla_pct + arena_pct + limo_pct no puede pasar de 100');
  res.status(201).json(await modelo.crearMuestraSuelo(req.idTerreno, datos));
}

module.exports = { listarMuestrasSuelo, crearMuestraSuelo };
