// Se ejecuta cuando ninguna ruta coincidió con la petición.
function rutaNoEncontrada(req, res) {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
}

// Manejador central de errores. Express lo reconoce porque recibe 4 parámetros.
function manejarErrores(err, req, res, next) {
  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido' });
  }

  const status = err.status || 500;
  console.error(err.stack);

  // En errores 500 no se envía el mensaje interno al cliente (puede exponer datos de la BD)
  res.status(status).json({
    mensaje: status === 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = { rutaNoEncontrada, manejarErrores };
