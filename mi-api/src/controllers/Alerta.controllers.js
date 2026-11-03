const crud = require('../utils/crud');
const { controladorCrud } = require('../utils/controladorCrud');
const { validarId } = require('../utils/validar');
const { noEncontrado } = require('../utils/errores');
const config = require('../models/Alerta.models');

async function marcarLeida(req, res) {
  const fila = await crud.actualizar(config.tabla, config.id, validarId(req.params.id), { leida: true });
  if (!fila) throw noEncontrado(config.que);
  res.json(fila);
}

module.exports = { ...controladorCrud(config), marcarLeida };
