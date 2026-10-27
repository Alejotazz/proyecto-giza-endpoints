const RetroalimentacionModel = require('../models/Retroalimentacion.models');

const getAllRetroalimentacion = async (req, res, next) => {
  try {
    const data = await RetroalimentacionModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getRetroalimentacionById = async (req, res, next) => {
  try {
    const feedback = await RetroalimentacionModel.getById(req.params.id);
    if (!feedback) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

const createRetroalimentacion = async (req, res, next) => {
  try {
    const nueva = await RetroalimentacionModel.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

const updateRetroalimentacion = async (req, res, next) => {
  try {
    const actualizada = await RetroalimentacionModel.update(req.params.id, req.body);
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

const deleteRetroalimentacion = async (req, res, next) => {
  try {
    await RetroalimentacionModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllRetroalimentacion, getRetroalimentacionById,
  createRetroalimentacion, updateRetroalimentacion, deleteRetroalimentacion
};