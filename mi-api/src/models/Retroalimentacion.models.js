const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM retroalimentacion');
  return rows;
};

const getById = async (id_feedback) => {
  const [rows] = await pool.query(
    'SELECT * FROM retroalimentacion WHERE id_feedback = ?',
    [id_feedback]
  );
  return rows[0];
};

const create = async (data) => {
  const { id_prediccion, id_cosecha, diferencia_estimado_real, incorporado_dataset } = data;
  const [result] = await pool.query(
    `INSERT INTO retroalimentacion
     (id_prediccion, id_cosecha, diferencia_estimado_real, incorporado_dataset)
     VALUES (?, ?, ?, ?)`,
    [id_prediccion, id_cosecha, diferencia_estimado_real, incorporado_dataset || false]
  );
  return { id_feedback: result.insertId, ...data };
};

const update = async (id_feedback, data) => {
  const { diferencia_estimado_real, incorporado_dataset } = data;
  await pool.query(
    `UPDATE retroalimentacion SET diferencia_estimado_real = ?, incorporado_dataset = ?
     WHERE id_feedback = ?`,
    [diferencia_estimado_real, incorporado_dataset, id_feedback]
  );
  return { id_feedback, ...data };
};

const remove = async (id_feedback) => {
  await pool.query('DELETE FROM retroalimentacion WHERE id_feedback = ?', [id_feedback]);
  return { id_feedback };
};

module.exports = { getAll, getById, create, update, remove };