const DatasetModel = require('../models/Dataset.models');

const getAllDataset = async (req, res, next) => {
  try {
    const data = await DatasetModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getDatasetById = async (req, res, next) => {
  try {
    const registro = await DatasetModel.getById(req.params.id);
    if (!registro) return res.status(404).json({ mensaje: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    next(err);
  }
};

const getDatasetByTerreno = async (req, res, next) => {
  try {
    const data = await DatasetModel.getByTerreno(req.params.id_terreno);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createDataset = async (req, res, next) => {
  try {
    const nuevo = await DatasetModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    next(err);
  }
};

const updateDataset = async (req, res, next) => {
  try {
    const actualizado = await DatasetModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    next(err);
  }
};

const deleteDataset = async (req, res, next) => {
  try {
    await DatasetModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDataset, getDatasetById, getDatasetByTerreno,
  createDataset, updateDataset, deleteDataset
};