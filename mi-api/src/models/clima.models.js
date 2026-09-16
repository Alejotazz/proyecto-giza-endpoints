const pool = require('../config/database');

async function obtenerClimaPorTerreno(idTerreno) {
  const [rows] = await pool.query('SELECT * FROM datos_meteorologicos WHERE id_terreno = ?', [idTerreno]);
  return rows;
}

async function crearDatoClima(idTerreno, datos) {
  const {
    fecha, temp_max, temp_min, temp_promedio, precipitacion_mm,
    humedad_relativa, radiacion_solar, velocidad_viento, indice_uv, gdd,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO datos_meteorologicos
      (id_terreno, fecha, temp_max, temp_min, temp_promedio, precipitacion_mm, humedad_relativa, radiacion_solar, velocidad_viento, indice_uv, gdd)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTerreno, fecha, temp_max, temp_min, temp_promedio, precipitacion_mm, humedad_relativa, radiacion_solar, velocidad_viento, indice_uv, gdd]
  );

  return { id_clima: resultado.insertId, id_terreno: idTerreno, ...datos };
}

module.exports = { obtenerClimaPorTerreno, crearDatoClima };
