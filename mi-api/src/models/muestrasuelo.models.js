const pool = require('../config/database');

async function obtenerMuestrasPorTerreno(idTerreno) {
  const [rows] = await pool.query('SELECT * FROM muestras_suelo WHERE id_terreno = ?', [idTerreno]);
  return rows;
}

async function crearMuestraSuelo(idTerreno, datos) {
  const {
    fecha_muestreo, ph, arcilla_pct, arena_pct, limo_pct, materia_organica,
    nitrogeno, fosforo, potasio, humedad, capacidad_retencion_agua, microorganismos,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO muestras_suelo
      (id_terreno, fecha_muestreo, ph, arcilla_pct, arena_pct, limo_pct, materia_organica, nitrogeno, fosforo, potasio, humedad, capacidad_retencion_agua, microorganismos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTerreno, fecha_muestreo, ph, arcilla_pct, arena_pct, limo_pct, materia_organica, nitrogeno, fosforo, potasio, humedad, capacidad_retencion_agua, microorganismos]
  );

  return { id_muestra: resultado.insertId, id_terreno: idTerreno, ...datos };
}

module.exports = { obtenerMuestrasPorTerreno, crearMuestraSuelo };
