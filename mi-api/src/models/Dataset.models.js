const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM dataset_procesado');
  return rows;
};

const getById = async (id_registro) => {
  const [rows] = await pool.query(
    'SELECT * FROM dataset_procesado WHERE id_registro = ?',
    [id_registro]
  );
  return rows[0];
};

const getByTerreno = async (id_terreno) => {
  const [rows] = await pool.query(
    'SELECT * FROM dataset_procesado WHERE id_terreno = ?',
    [id_terreno]
  );
  return rows;
};

const create = async (data) => {
  const {
    id_terreno, id_cultivo, temporada, ndvi, evi, indice_fertilidad,
    lluvia_acumulada, gdd_acumulado, tendencia_rendimiento_5temp, particion
  } = data;
  const [result] = await pool.query(
    `INSERT INTO dataset_procesado
     (id_terreno, id_cultivo, temporada, ndvi, evi, indice_fertilidad,
      lluvia_acumulada, gdd_acumulado, tendencia_rendimiento_5temp, particion)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_terreno, id_cultivo, temporada, ndvi, evi, indice_fertilidad,
     lluvia_acumulada, gdd_acumulado, tendencia_rendimiento_5temp, particion]
  );
  return { id_registro: result.insertId, ...data };
};

const update = async (id_registro, data) => {
  const {
    id_terreno, id_cultivo, temporada, ndvi, evi, indice_fertilidad,
    lluvia_acumulada, gdd_acumulado, tendencia_rendimiento_5temp, particion
  } = data;
  await pool.query(
    `UPDATE dataset_procesado SET
     id_terreno = ?, id_cultivo = ?, temporada = ?, ndvi = ?, evi = ?,
     indice_fertilidad = ?, lluvia_acumulada = ?, gdd_acumulado = ?,
     tendencia_rendimiento_5temp = ?, particion = ?
     WHERE id_registro = ?`,
    [id_terreno, id_cultivo, temporada, ndvi, evi, indice_fertilidad,
     lluvia_acumulada, gdd_acumulado, tendencia_rendimiento_5temp, particion, id_registro]
  );
  return { id_registro, ...data };
};

const remove = async (id_registro) => {
  await pool.query('DELETE FROM dataset_procesado WHERE id_registro = ?', [id_registro]);
  return { id_registro };
};

module.exports = { getAll, getById, getByTerreno, create, update, remove };