const ModeloIAModel = require('../models/modelo.model');

const getAllModelos = async (req, res) => {
  try {
    const data = await ModeloIAModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getModeloById = async (req, res) => {
  try {
    const modelo = await ModeloIAModel.getById(req.params.id);
    if (!modelo) return res.status(404).json({ error: 'Modelo no encontrado' });
    res.json(modelo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createModelo = async (req, res) => {
  try {
    const nuevo = await ModeloIAModel.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateModelo = async (req, res) => {
  try {
    const actualizado = await ModeloIAModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteModelo = async (req, res) => {
  try {
    await ModeloIAModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllModelos, getModeloById, createModelo, updateModelo, deleteModelo };