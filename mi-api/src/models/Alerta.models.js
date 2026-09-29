const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM alertas');
  return rows;
};

const getById = async (id_alerta) => {
  const [rows] = await pool.query(
    'SELECT * FROM alertas WHERE id_alerta = ?',
    [id_alerta]
  );
  return rows[0];
};

const getByPrediccion = async (id_prediccion) => {
  const [rows] = await pool.query(
    'SELECT * FROM alertas WHERE id_prediccion = ?',
    [id_prediccion]
  );
  return rows;
};

const create = async (id_prediccion, data) => {
  const { tipo_alerta, mensaje } = data;
  const [result] = await pool.query(
    `INSERT INTO alertas (id_prediccion, tipo_alerta, mensaje)
     VALUES (?, ?, ?)`,
    [id_prediccion, tipo_alerta, mensaje]
  );
  return { id_alerta: result.insertId, id_prediccion, ...data };
};

const marcarLeida = async (id_alerta) => {
  await pool.query('UPDATE alertas SET leida = TRUE WHERE id_alerta = ?', [id_alerta]);
  return { id_alerta, leida: true };
};

const remove = async (id_alerta) => {
  await pool.query('DELETE FROM alertas WHERE id_alerta = ?', [id_alerta]);
  return { id_alerta };
};

module.exports = { getAll, getById, getByPrediccion, create, marcarLeida, remove };