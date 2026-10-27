const EntrenamientoModel = require('../models/Entrenamiento.models');

const getAllEntrenamientos = async (req, res, next) => {
  try {
    const data = await EntrenamientoModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getEntrenamientoById = async (req, res, next) => {
  try {
    const entrenamiento = await EntrenamientoModel.getById(req.params.id);
    if (!entrenamiento) return res.status(404).json({ mensaje: 'Entrenamiento no encontrado' });
    res.json(entrenamiento);
  } catch (err) {
    next(err);
  }
};

const getEntrenamientosByModelo = async (req, res, next) => {
  try {
    const data = await EntrenamientoModel.getByModelo(req.params.id_modelo);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createEntrenamiento = async (req, res, next) => {
  try {
    const nuevo = await EntrenamientoModel.create(req.params.id_modelo, req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};

const updateEntrenamiento = async (req, res, next) => {
  try {
    const actualizado = await EntrenamientoModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};

const deleteEntrenamiento = async (req, res, next) => {
  try {
    await EntrenamientoModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEntrenamientos, getEntrenamientoById, getEntrenamientosByModelo,
  createEntrenamiento, updateEntrenamiento, deleteEntrenamiento
};