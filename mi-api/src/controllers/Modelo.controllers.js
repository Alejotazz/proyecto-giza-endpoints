const ModeloIAModel = require('../models/Modelo.models');

const getAllModelos = async (req, res, next) => {
  try {
    const data = await ModeloIAModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getModeloById = async (req, res, next) => {
  try {
    const modelo = await ModeloIAModel.getById(req.params.id);
    if (!modelo) return res.status(404).json({ mensaje: 'Modelo no encontrado' });
    res.json(modelo);
  } catch (err) {
    next(err);
  }
};

const createModelo = async (req, res, next) => {
  try {
    const nuevo = await ModeloIAModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};

const updateModelo = async (req, res, next) => {
  try {
    const actualizado = await ModeloIAModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};

const deleteModelo = async (req, res, next) => {
  try {
    await ModeloIAModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllModelos, getModeloById, createModelo, updateModelo, deleteModelo };