// Error con código HTTP. Se lanza desde controllers/models y lo responde error.middleware.js
class HttpError extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    if (detalles) this.detalles = detalles;
  }
}

const noEncontrado = (que = 'Registro') => new HttpError(404, `${que} no encontrado`);
const peticionInvalida = (mensaje, detalles) => new HttpError(400, mensaje, detalles);

module.exports = { HttpError, noEncontrado, peticionInvalida };
