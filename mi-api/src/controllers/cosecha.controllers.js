const modelo = require('../models/cosecha.models');

async function listarCosechas(req, res, next) {
  try {
    const cosechas = await modelo.obtenerCosechasPorTerreno(req.params.id);
    res.json(cosechas);
  } catch (error) {
    next(error);
  }
}

async function obtenerCosecha(req, res, next) {
  try {
    const cosecha = await modelo.obtenerCosechaPorId(req.params.id);
    if (!cosecha) return res.status(404).json({ mensaje: 'Cosecha no encontrada' });
    res.json(cosecha);
  } catch (error) {
    next(error);
  }
}

async function crearCosecha(req, res, next) {
  try {
    const nuevaCosecha = await modelo.crearCosecha(req.params.id, req.body);
    res.status(201).json(nuevaCosecha);
  } catch (error) {
    next(error);
  }
}

async function actualizarCosecha(req, res, next) {
  try {
    const cosechaActualizada = await modelo.actualizarCosecha(req.params.id, req.body);
    res.json(cosechaActualizada);
  } catch (error) {
    next(error);
  }
}

async function eliminarCosecha(req, res, next) {
  try {
    const eliminada = await modelo.eliminarCosecha(req.params.id);
    if (!eliminada) return res.status(404).json({ mensaje: 'Cosecha no encontrada' });
    res.json({ mensaje: 'Cosecha eliminada correctamente' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listarCosechas, obtenerCosecha, crearCosecha, actualizarCosecha, eliminarCosecha };
