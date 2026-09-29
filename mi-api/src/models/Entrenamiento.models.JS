const pool = require('../config/db');

const getAll = async () => {
  const [rows] = await pool.query('SELECT * FROM entrenamientos');
  return rows;
};

const getById = async (id_entrenamiento) => {
  const [rows] = await pool.query(
    'SELECT * FROM entrenamientos WHERE id_entrenamiento = ?',
    [id_entrenamiento]
  );
  return rows[0];
};

const getByModelo = async (id_modelo) => {
  const [rows] = await pool.query(
    'SELECT * FROM entrenamientos WHERE id_modelo = ?',
    [id_modelo]
  );
  return rows;
};

const create = async (id_modelo, data) => {
  const {
    fecha_inicio, fecha_fin, funcion_perdida, metrica_evaluacion,
    learning_rate, capas, neuronas, regularizacion, data_augmentation, estado
  } = data;
  const [result] = await pool.query(
    `INSERT INTO entrenamientos
     (id_modelo, fecha_inicio, fecha_fin, funcion_perdida, metrica_evaluacion,
      learning_rate, capas, neuronas, regularizacion, data_augmentation, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_modelo, fecha_inicio, fecha_fin, funcion_perdida, metrica_evaluacion,
     learning_rate, capas, neuronas, regularizacion, data_augmentation || false,
     estado || 'en_progreso']
  );
  return { id_entrenamiento: result.insertId, id_modelo, ...data };
};

const update = async (id_entrenamiento, data) => {
  const {
    fecha_inicio, fecha_fin, funcion_perdida, metrica_evaluacion,
    learning_rate, capas, neuronas, regularizacion, data_augmentation, estado
  } = data;
  await pool.query(
    `UPDATE entrenamientos SET
     fecha_inicio = ?, fecha_fin = ?, funcion_perdida = ?, metrica_evaluacion = ?,
     learning_rate = ?, capas = ?, neuronas = ?, regularizacion = ?,
     data_augmentation = ?, estado = ? WHERE id_entrenamiento = ?`,
    [fecha_inicio, fecha_fin, funcion_perdida, metrica_evaluacion,
     learning_rate, capas, neuronas, regularizacion, data_augmentation,
     estado, id_entrenamiento]
  );
  return { id_entrenamiento, ...data };
};

const remove = async (id_entrenamiento) => {
  await pool.query('DELETE FROM entrenamientos WHERE id_entrenamiento = ?', [id_entrenamiento]);
  return { id_entrenamiento };
};

module.exports = { getAll, getById, getByModelo, create, update, remove };