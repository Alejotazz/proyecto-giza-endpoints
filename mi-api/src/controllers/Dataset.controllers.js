const DatasetModel = require('../models/dataset.model');

const getAllDataset = async (req, res) => {
  try {
    const data = await DatasetModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDatasetById = async (req, res) => {
  try {
    const registro = await DatasetModel.getById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDatasetByTerreno = async (req, res) => {
  try {
    const data = await DatasetModel.getByTerreno(req.params.id_terreno);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDataset = async (req, res) => {
  try {
    const nuevo = await DatasetModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDataset = async (req, res) => {
  try {
    const actualizado = await DatasetModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDataset = async (req, res) => {
  try {
    await DatasetModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDataset, getDatasetById, getDatasetByTerreno,
  createDataset, updateDataset, deleteDataset
};