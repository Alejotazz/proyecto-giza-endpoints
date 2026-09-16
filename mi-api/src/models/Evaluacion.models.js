const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM evaluaciones');
  return rows;
};

const getById = async (id_evaluacion) => {
  const [rows] = await pool.query(
    'SELECT * FROM evaluaciones WHERE id_evaluacion = ?',
    [id_evaluacion]
  );
  return rows[0];
};

const getByEntrenamiento = async (id_entrenamiento) => {
  const [rows] = await pool.query(
    'SELECT * FROM evaluaciones WHERE id_entrenamiento = ?',
    [id_entrenamiento]
  );
  return rows;
};

const create = async (id_entrenamiento, data) => {
  const { mae, rmse, r2, precision_val, recall_val, f1_score, supera_umbral } = data;
  const [result] = await pool.query(
    `INSERT INTO evaluaciones
     (id_entrenamiento, mae, rmse, r2, precision_val, recall_val, f1_score, supera_umbral)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_entrenamiento, mae, rmse, r2, precision_val, recall_val, f1_score, supera_umbral]
  );
  return { id_evaluacion: result.insertId, id_entrenamiento, ...data };
};

const update = async (id_evaluacion, data) => {
  const { mae, rmse, r2, precision_val, recall_val, f1_score, supera_umbral } = data;
  await pool.query(
    `UPDATE evaluaciones SET mae = ?, rmse = ?, r2 = ?, precision_val = ?,
     recall_val = ?, f1_score = ?, supera_umbral = ? WHERE id_evaluacion = ?`,
    [mae, rmse, r2, precision_val, recall_val, f1_score, supera_umbral, id_evaluacion]
  );
  return { id_evaluacion, ...data };
};

const remove = async (id_evaluacion) => {
  await pool.query('DELETE FROM evaluaciones WHERE id_evaluacion = ?', [id_evaluacion]);
  return { id_evaluacion };
};

module.exports = { getAll, getById, getByEntrenamiento, create, update, remove };