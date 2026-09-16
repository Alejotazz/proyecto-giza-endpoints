const pool = require('../config/database');

async function obtenerCosechasPorTerreno(idTerreno) {
  const [rows] = await pool.query('SELECT * FROM historial_cosechas WHERE id_terreno = ?', [idTerreno]);
  return rows;
}

async function obtenerCosechaPorId(id) {
  const [rows] = await pool.query('SELECT * FROM historial_cosechas WHERE id_cosecha = ?', [id]);
  return rows[0];
}

async function crearCosecha(idTerreno, datos) {
  const {
    id_cultivo, temporada, fecha_siembra, fecha_cosecha,
    variedad_semilla, rendimiento_kg_ha, insumos_aplicados, incidencia_plagas,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO historial_cosechas
      (id_terreno, id_cultivo, temporada, fecha_siembra, fecha_cosecha, variedad_semilla, rendimiento_kg_ha, insumos_aplicados, incidencia_plagas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTerreno, id_cultivo, temporada, fecha_siembra, fecha_cosecha, variedad_semilla, rendimiento_kg_ha, insumos_aplicados, incidencia_plagas]
  );

  return { id_cosecha: resultado.insertId, id_terreno: idTerreno, ...datos };
}

async function actualizarCosecha(id, datos) {
  const {
    id_cultivo, temporada, fecha_siembra, fecha_cosecha,
    variedad_semilla, rendimiento_kg_ha, insumos_aplicados, incidencia_plagas,
  } = datos;

  await pool.query(
    `UPDATE historial_cosechas SET
      id_cultivo = ?, temporada = ?, fecha_siembra = ?, fecha_cosecha = ?,
      variedad_semilla = ?, rendimiento_kg_ha = ?, insumos_aplicados = ?, incidencia_plagas = ?
     WHERE id_cosecha = ?`,
    [id_cultivo, temporada, fecha_siembra, fecha_cosecha, variedad_semilla, rendimiento_kg_ha, insumos_aplicados, incidencia_plagas, id]
  );

  return obtenerCosechaPorId(id);
}

async function eliminarCosecha(id) {
  const [resultado] = await pool.query('DELETE FROM historial_cosechas WHERE id_cosecha = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { obtenerCosechasPorTerreno, obtenerCosechaPorId, crearCosecha, actualizarCosecha, eliminarCosecha };
