const AlertaModel = require('../models/alerta.model');

const getAllAlertas = async (req, res) => {
  try {
    const data = await AlertaModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlertaById = async (req, res) => {
  try {
    const alerta = await AlertaModel.getById(req.params.id);
    if (!alerta) return res.status(404).json({ error: 'Alerta no encontrada' });
    res.json(alerta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAlertasByPrediccion = async (req, res) => {
  try {
    const data = await AlertaModel.getByPrediccion(req.params.id_prediccion);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAlerta = async (req, res) => {
  try {
    const nueva = await AlertaModel.create(req.params.id_prediccion, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const marcarAlertaLeida = async (req, res) => {
  try {
    const actualizada = await AlertaModel.marcarLeida(req.params.id);
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAlerta = async (req, res) => {
  try {
    await AlertaModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAlertas, getAlertaById, getAlertasByPrediccion,
  createAlerta, marcarAlertaLeida, deleteAlerta
};