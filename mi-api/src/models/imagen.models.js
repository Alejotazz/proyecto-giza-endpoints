const pool = require('../config/database');

async function obtenerImagenesPorTerreno(idTerreno) {
  const [rows] = await pool.query('SELECT * FROM capturas_imagenes WHERE id_terreno = ?', [idTerreno]);
  return rows;
}

async function crearImagen(idTerreno, datos) {
  const {
    tipo_imagen, url_archivo, fecha_captura, hora_captura,
    coordenadas_gps, zona_interes, nivel_rendimiento_esperado,
  } = datos;

  const [resultado] = await pool.query(
    `INSERT INTO capturas_imagenes
      (id_terreno, tipo_imagen, url_archivo, fecha_captura, hora_captura, coordenadas_gps, zona_interes, nivel_rendimiento_esperado)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [idTerreno, tipo_imagen, url_archivo, fecha_captura, hora_captura, coordenadas_gps, zona_interes, nivel_rendimiento_esperado]
  );

  return { id_imagen: resultado.insertId, id_terreno: idTerreno, ...datos };
}

// Etiquetado manual (saludable / estresado / enfermo)
async function actualizarImagen(id, datos) {
  const { etiqueta_estado, validado_doble_panel } = datos;

  await pool.query(
    `UPDATE capturas_imagenes SET
      etiqueta_estado = ?, validado_doble_panel = ?, fecha_etiquetado = NOW()
     WHERE id_imagen = ?`,
    [etiqueta_estado, validado_doble_panel, id]
  );

  const [rows] = await pool.query('SELECT * FROM capturas_imagenes WHERE id_imagen = ?', [id]);
  return rows[0];
}

module.exports = { obtenerImagenesPorTerreno, crearImagen, actualizarImagen };