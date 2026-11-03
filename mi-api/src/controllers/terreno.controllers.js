const modelo = require('../models/terreno.models');
const { validar, validarId } = require('../utils/validar');
const { noEncontrado } = require('../utils/errores');
const { esAdmin } = require('../middleware/acceso.middleware');

// Los errores de estas funciones async los responde error.middleware.js (Express 5)

async function listarTerrenos(req, res) {
  const terrenos = esAdmin(req)
    ? await modelo.obtenerTerrenos(req.query)
    : await modelo.obtenerTerrenosDeUsuario(req.usuario.id_usuario, req.query);
  res.json(terrenos);
}

async function obtenerTerreno(req, res) {
  const terreno = await modelo.obtenerTerrenoPorId(validarId(req.params.id));
  if (!terreno) throw noEncontrado('Terreno');
  res.json(terreno);
}

async function crearTerreno(req, res) {
  const datos = validar(modelo.esquema, req.body);
  res.status(201).json(await modelo.crearTerreno(datos));
}

async function actualizarTerreno(req, res) {
  const datos = validar(modelo.esquema, req.body, { parcial: true });
  const terreno = await modelo.actualizarTerreno(validarId(req.params.id), datos);
  if (!terreno) throw noEncontrado('Terreno');
  res.json(terreno);
}

async function eliminarTerreno(req, res) {
  const eliminado = await modelo.eliminarTerreno(validarId(req.params.id));
  if (!eliminado) throw noEncontrado('Terreno');
  res.json({ mensaje: 'Terreno eliminado correctamente' });
}

module.exports = { listarTerrenos, obtenerTerreno, crearTerreno, actualizarTerreno, eliminarTerreno };
