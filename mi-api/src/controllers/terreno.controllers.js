const modelo = require('../models/terreno.models');

async function listarTerrenos(req, res) {
  try {
    const terrenos = await modelo.obtenerTerrenos();
    res.json(terrenos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerTerreno(req, res) {
  try {
    const terreno = await modelo.obtenerTerrenoPorId(req.params.id);
    if (!terreno) return res.status(404).json({ error: 'Terreno no encontrado' });
    res.json(terreno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearTerreno(req, res) {
  try {
    const nuevoTerreno = await modelo.crearTerreno(req.body);
    res.status(201).json(nuevoTerreno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function actualizarTerreno(req, res) {
  try {
    const terrenoActualizado = await modelo.actualizarTerreno(req.params.id, req.body);
    res.json(terrenoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarTerreno(req, res) {
  try {
    const eliminado = await modelo.eliminarTerreno(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Terreno no encontrado' });
    res.json({ mensaje: 'Terreno eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarTerrenos, obtenerTerreno, crearTerreno, actualizarTerreno, eliminarTerreno };