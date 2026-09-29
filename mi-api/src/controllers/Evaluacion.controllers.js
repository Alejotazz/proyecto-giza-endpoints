const EvaluacionModel = require('../models/evaluacion.model');

const getAllEvaluaciones = async (req, res) => {
  try {
    const data = await EvaluacionModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvaluacionById = async (req, res) => {
  try {
    const evaluacion = await EvaluacionModel.getById(req.params.id);
    if (!evaluacion) return res.status(404).json({ error: 'Evaluación no encontrada' });
    res.json(evaluacion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvaluacionesByEntrenamiento = async (req, res) => {
  try {
    const data = await EvaluacionModel.getByEntrenamiento(req.params.id_entrenamiento);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEvaluacion = async (req, res) => {
  try {
    const nueva = await EvaluacionModel.create(req.params.id_entrenamiento, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEvaluacion = async (req, res) => {
  try {
    const actualizada = await EvaluacionModel.update(req.params.id, req.body);
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEvaluacion = async (req, res) => {
  try {
    await EvaluacionModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEvaluaciones, getEvaluacionById, getEvaluacionesByEntrenamiento,
  createEvaluacion, updateEvaluacion, deleteEvaluacion
};