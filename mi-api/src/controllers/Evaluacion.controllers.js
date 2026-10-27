const EvaluacionModel = require('../models/Evaluacion.models');

const getAllEvaluaciones = async (req, res, next) => {
  try {
    const data = await EvaluacionModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getEvaluacionById = async (req, res, next) => {
  try {
    const evaluacion = await EvaluacionModel.getById(req.params.id);
    if (!evaluacion) return res.status(404).json({ mensaje: 'Evaluación no encontrada' });
    res.json(evaluacion);
  } catch (err) {
    next(err);
  }
};

const getEvaluacionesByEntrenamiento = async (req, res, next) => {
  try {
    const data = await EvaluacionModel.getByEntrenamiento(req.params.id_entrenamiento);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createEvaluacion = async (req, res, next) => {
  try {
    const nueva = await EvaluacionModel.create(req.params.id_entrenamiento, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

const updateEvaluacion = async (req, res, next) => {
  try {
    const actualizada = await EvaluacionModel.update(req.params.id, req.body);
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

const deleteEvaluacion = async (req, res, next) => {
  try {
    await EvaluacionModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvaluaciones, getEvaluacionById, getEvaluacionesByEntrenamiento,
  createEvaluacion, updateEvaluacion, deleteEvaluacion
};