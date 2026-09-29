const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM modelos_ia');
  return rows;
};

const getById = async (id_modelo) => {
  const [rows] = await pool.query(
    'SELECT * FROM modelos_ia WHERE id_modelo = ?',
    [id_modelo]
  );
  return rows[0];
};

const create = async (data) => {
  const { nombre_modelo, tipo, arquitectura, id_cultivo, version } = data;
  const [result] = await pool.query(
    `INSERT INTO modelos_ia (nombre_modelo, tipo, arquitectura, id_cultivo, version)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre_modelo, tipo, arquitectura, id_cultivo, version]
  );
  return { id_modelo: result.insertId, ...data };
};

const update = async (id_modelo, data) => {
  const { nombre_modelo, tipo, arquitectura, id_cultivo, version } = data;
  await pool.query(
    `UPDATE modelos_ia SET nombre_modelo = ?, tipo = ?, arquitectura = ?,
     id_cultivo = ?, version = ? WHERE id_modelo = ?`,
    [nombre_modelo, tipo, arquitectura, id_cultivo, version, id_modelo]
  );
  return { id_modelo, ...data };
};

const remove = async (id_modelo) => {
  await pool.query('DELETE FROM modelos_ia WHERE id_modelo = ?', [id_modelo]);
  return { id_modelo };
};

module.exports = { getAll, getById, create, update, remove };