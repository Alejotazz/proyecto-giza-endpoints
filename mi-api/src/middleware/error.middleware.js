// Se ejecuta cuando ninguna ruta coincidió con la petición.
function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

// Errores de MySQL que son culpa de los datos enviados, no del servidor
const ERRORES_BD = {
  ER_NO_REFERENCED_ROW_2: [400, 'Algún id enviado no existe (llave foránea)'],
  ER_ROW_IS_REFERENCED_2: [409, 'No se puede eliminar: tiene datos asociados'],
  ER_DUP_ENTRY: [409, 'Ese registro ya existe'],
  ER_BAD_NULL_ERROR: [400, 'Falta un campo obligatorio'],
  ER_NO_DEFAULT_FOR_FIELD: [400, 'Falta un campo obligatorio'],
  ER_TRUNCATED_WRONG_VALUE: [400, 'Algún campo tiene un formato inválido'],
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: [400, 'Algún campo tiene un formato inválido'],
  WARN_DATA_TRUNCATED: [400, 'Algún campo tiene un valor inválido'],
  ER_DATA_TOO_LONG: [400, 'Algún campo es demasiado largo'],
};

// Manejador central de errores. Express lo reconoce porque recibe 4 parámetros.
function manejarErrores(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  if (ERRORES_BD[err.code]) {
    const [status, mensaje] = ERRORES_BD[err.code];
    return res.status(status).json({ mensaje });
  }

  const status = err.status || 500;
  console.error(err.stack);

  // En errores 500 no se envía el mensaje interno al cliente (puede exponer datos de la BD)
  res.status(status).json({
    mensaje: status === 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = { rutaNoEncontrada, manejarErrores };
