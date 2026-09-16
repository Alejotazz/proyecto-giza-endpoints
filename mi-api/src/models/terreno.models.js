const pool = require('../config/database');

async function obtenerTerrenos() {
  const [rows] = await pool.query('SELECT * FROM terrenos');
  return rows;
}

async function obtenerTerrenoPorId(id) {
  const [rows] = await pool.query('SELECT * FROM terrenos WHERE id_terreno = ?', [id]);
  return rows[0];
}

async function crearTerreno(datos) {
  const {
    nombre, id_cultivo, area_hectareas, altitud_msnm, topografia,
    pendiente, sistema_riego, historial_uso_terreno, coordenadas_lat, coordenadas_lon,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO terrenos
      (nombre, id_cultivo, area_hectareas, altitud_msnm, topografia, pendiente, sistema_riego, historial_uso_terreno, coordenadas_lat, coordenadas_lon)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, id_cultivo, area_hectareas, altitud_msnm, topografia, pendiente, sistema_riego, historial_uso_terreno, coordenadas_lat, coordenadas_lon]
  );

  return { id_terreno: resultado.insertId, ...datos };
}

async function actualizarTerreno(id, datos) {
  const {
    nombre, id_cultivo, area_hectareas, altitud_msnm, topografia,
    pendiente, sistema_riego, historial_uso_terreno, coordenadas_lat, coordenadas_lon,
  } = datos;

  await pool.query(
    `UPDATE terrenos SET
      nombre = ?, id_cultivo = ?, area_hectareas = ?, altitud_msnm = ?, topografia = ?,
      pendiente = ?, sistema_riego = ?, historial_uso_terreno = ?, coordenadas_lat = ?, coordenadas_lon = ?
     WHERE id_terreno = ?`,
    [nombre, id_cultivo, area_hectareas, altitud_msnm, topografia, pendiente, sistema_riego, historial_uso_terreno, coordenadas_lat, coordenadas_lon, id]
  );

  return obtenerTerrenoPorId(id);
}

async function eliminarTerreno(id) {
  const [resultado] = await pool.query('DELETE FROM terrenos WHERE id_terreno = ?', [id]);
  return resultado.affectedRows > 0;
}

module.exports = { obtenerTerrenos, obtenerTerrenoPorId, crearTerreno, actualizarTerreno, eliminarTerreno };