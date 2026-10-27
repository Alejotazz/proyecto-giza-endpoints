const AlertaModel = require('../models/Alerta.models');

const getAllAlertas = async (req, res, next) => {
  try {
    const data = await AlertaModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getAlertaById = async (req, res, next) => {
  try {
    const alerta = await AlertaModel.getById(req.params.id);
    if (!alerta) return res.status(404).json({ mensaje: 'Alerta no encontrada' });
    res.json(alerta);
  } catch (err) {
    next(err);
  }
};

const getAlertasByPrediccion = async (req, res, next) => {
  try {
    const data = await AlertaModel.getByPrediccion(req.params.id_prediccion);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createAlerta = async (req, res, next) => {
  try {
    const nueva = await AlertaModel.create(req.params.id_prediccion, req.body);
    res.status(201).json(nueva);
  } catch (err) {
    next(err);
  }
};

const marcarAlertaLeida = async (req, res, next) => {
  try {
    const actualizada = await AlertaModel.marcarLeida(req.params.id);
    res.json(actualizada);
  } catch (err) {
    next(err);
  }
};

const deleteAlerta = async (req, res, next) => {
  try {
    await AlertaModel.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllAlertas, getAlertaById, getAlertasByPrediccion,
  createAlerta, marcarAlertaLeida, deleteAlerta
};