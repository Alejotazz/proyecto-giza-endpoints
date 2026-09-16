const EntrenamientoModel = require('../models/entrenamiento.model');

const getAllEntrenamientos = async (req, res) => {
  try {
    const data = await EntrenamientoModel.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEntrenamientoById = async (req, res) => {
  try {
    const entrenamiento = await EntrenamientoModel.getById(req.params.id);
    if (!entrenamiento) return res.status(404).json({ error: 'Entrenamiento no encontrado' });
    res.json(entrenamiento);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEntrenamientosByModelo = async (req, res) => {
  try {
    const data = await EntrenamientoModel.getByModelo(req.params.id_modelo);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createEntrenamiento = async (req, res) => {
  try {
    const nuevo = await EntrenamientoModel.create(req.params.id_modelo, req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEntrenamiento = async (req, res) => {
  try {
    const actualizado = await EntrenamientoModel.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEntrenamiento = async (req, res) => {
  try {
    await EntrenamientoModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllEntrenamientos, getEntrenamientoById, getEntrenamientosByModelo,
  createEntrenamiento, updateEntrenamiento, deleteEntrenamiento
};