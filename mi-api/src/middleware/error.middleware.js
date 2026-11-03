// Se ejecuta cuando ninguna ruta coincidió con la petición.
function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

// Errores de MySQL que son culpa de los datos enviados (no del servidor)
const ERRORES_MYSQL = {
  ER_DUP_ENTRY: [409, 'Ya existe un registro con esos datos (valor duplicado)'],
  ER_NO_REFERENCED_ROW: [400, 'Alguno de los ids enviados no existe'],
  ER_NO_REFERENCED_ROW_2: [400, 'Alguno de los ids enviados no existe'],
  ER_ROW_IS_REFERENCED: [409, 'No se puede borrar: otros registros dependen de este'],
  ER_ROW_IS_REFERENCED_2: [409, 'No se puede borrar: otros registros dependen de este'],
  ER_BAD_NULL_ERROR: [400, 'Falta un campo obligatorio'],
  ER_NO_DEFAULT_FOR_FIELD: [400, 'Falta un campo obligatorio'],
  ER_TRUNCATED_WRONG_VALUE: [400, 'Algún valor tiene un formato inválido'],
  ER_TRUNCATED_WRONG_VALUE_FOR_FIELD: [400, 'Algún valor tiene un formato inválido'],
  WARN_DATA_TRUNCATED: [400, 'Algún valor no es válido para su campo'],
  ER_DATA_TOO_LONG: [400, 'Algún texto es demasiado largo'],
  ER_WARN_DATA_OUT_OF_RANGE: [400, 'Algún número está fuera de rango'],
};

// Manejador central de errores. Express lo reconoce porque recibe 4 parámetros.
// Express 5 manda aquí automáticamente los errores de las funciones async.
function manejarErrores(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ mensaje: 'El cuerpo de la petición es demasiado grande' });
  }

  if (err.code && ERRORES_MYSQL[err.code]) {
    const [status, mensaje] = ERRORES_MYSQL[err.code];
    return res.status(status).json({ mensaje });
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err.stack || err);

  // En errores 500 no se envía el mensaje interno al cliente (puede exponer datos de la BD)
  const cuerpo = { mensaje: status >= 500 ? 'Error interno del servidor' : err.message };
  if (status < 500 && err.detalles) cuerpo.errores = err.detalles;
  res.status(status).json(cuerpo);
}

module.exports = { rutaNoEncontrada, manejarErrores };
