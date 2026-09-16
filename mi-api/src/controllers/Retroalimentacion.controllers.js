const RetroalimentacionModel = require('../models/retroalimentacion.model');

const getAllRetroalimentacion = async (req, res) => {
  try {
    const data = await RetroalimentacionModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getRetroalimentacionById = async (req, res) => {
  try {
    const feedback = await RetroalimentacionModel.getById(req.params.id);
    if (!feedback) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createRetroalimentacion = async (req, res) => {
  try {
    const nueva = await RetroalimentacionModel.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateRetroalimentacion = async (req, res) => {
  try {
    const actualizada = await RetroalimentacionModel.update(req.params.id, req.body);
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRetroalimentacion = async (req, res) => {
  try {
    await RetroalimentacionModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRetroalimentacion, getRetroalimentacionById,
  createRetroalimentacion, updateRetroalimentacion, deleteRetroalimentacion
};