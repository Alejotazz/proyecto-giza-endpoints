const modelo = require('../models/cosecha.models');

async function listarCosechas(req, res) {
  try {
    const cosechas = await modelo.obtenerCosechasPorTerreno(req.params.id);
    res.json(cosechas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerCosecha(req, res) {
  try {
    const cosecha = await modelo.obtenerCosechaPorId(req.params.id);
    if (!cosecha) return res.status(404).json({ error: 'Cosecha no encontrada' });
    res.json(cosecha);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearCosecha(req, res) {
  try {
    const nuevaCosecha = await modelo.crearCosecha(req.params.id, req.body);
    res.status(201).json(nuevaCosecha);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function actualizarCosecha(req, res) {
  try {
    const cosechaActualizada = await modelo.actualizarCosecha(req.params.id, req.body);
    res.json(cosechaActualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarCosecha(req, res) {
  try {
    const eliminada = await modelo.eliminarCosecha(req.params.id);
    if (!eliminada) return res.status(404).json({ error: 'Cosecha no encontrada' });
    res.json({ mensaje: 'Cosecha eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarCosechas, obtenerCosecha, crearCosecha, actualizarCosecha, eliminarCosecha };
