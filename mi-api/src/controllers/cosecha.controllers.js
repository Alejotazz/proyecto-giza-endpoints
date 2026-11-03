const modelo = require('../models/cosecha.models');
const { validar, validarId } = require('../utils/validar');
const { noEncontrado, peticionInvalida } = require('../utils/errores');

// req.idTerreno lo pone verificarAccesoTerreno (ver cosecha.routes.js)

function revisarFechas(datos, actual = {}) {
  const siembra = datos.fecha_siembra ?? actual.fecha_siembra;
  const cosecha = datos.fecha_cosecha ?? actual.fecha_cosecha;
  if (siembra && cosecha && new Date(cosecha) < new Date(siembra)) {
    throw peticionInvalida('fecha_cosecha no puede ser anterior a fecha_siembra');
  }
}

async function listarCosechas(req, res) {
  res.json(await modelo.obtenerCosechasPorTerreno(req.idTerreno, req.query));
}

async function obtenerCosecha(req, res) {
  const cosecha = await modelo.obtenerCosechaPorId(validarId(req.params.id));
  if (!cosecha) throw noEncontrado('Cosecha');
  res.json(cosecha);
}

async function crearCosecha(req, res) {
  const datos = validar(modelo.esquema, req.body);
  revisarFechas(datos);
  res.status(201).json(await modelo.crearCosecha(req.idTerreno, datos));
}

async function actualizarCosecha(req, res) {
  const id = validarId(req.params.id);
  const datos = validar(modelo.esquema, req.body, { parcial: true });
  revisarFechas(datos, await modelo.obtenerCosechaPorId(id));
  const cosecha = await modelo.actualizarCosecha(id, datos);
  if (!cosecha) throw noEncontrado('Cosecha');
  res.json(cosecha);
}

async function eliminarCosecha(req, res) {
  const eliminada = await modelo.eliminarCosecha(validarId(req.params.id));
  if (!eliminada) throw noEncontrado('Cosecha');
  res.json({ mensaje: 'Cosecha eliminada correctamente' });
}

module.exports = { listarCosechas, obtenerCosecha, crearCosecha, actualizarCosecha, eliminarCosecha };
