const modelo = require('../models/imagen.models');
const { validar, validarId } = require('../utils/validar');
const { noEncontrado } = require('../utils/errores');

async function listarImagenes(req, res) {
  res.json(await modelo.obtenerImagenesPorTerreno(req.idTerreno, req.query));
}

async function crearImagen(req, res) {
  const datos = validar(modelo.esquema, req.body);
  res.status(201).json(await modelo.crearImagen(req.idTerreno, datos));
}

async function etiquetarImagen(req, res) {
  const datos = validar(modelo.esquemaEtiqueta, req.body, { parcial: true });
  const imagen = await modelo.actualizarImagen(validarId(req.params.id), datos);
  if (!imagen) throw noEncontrado('Imagen');
  res.json(imagen);
}

module.exports = { listarImagenes, crearImagen, etiquetarImagen };
