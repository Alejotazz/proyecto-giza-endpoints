const crud = require('../utils/crud');
const { controladorCrud } = require('../utils/controladorCrud');
const config = require('../models/Dataset.models');

// req.idTerreno lo pone verificarAccesoTerreno (ver Dataset.routes.js)
async function listarPorTerreno(req, res) {
  res.json(await crud.listar(config.tabla, {
    where: 'id_terreno = ?', params: [req.idTerreno], query: req.query, orden: config.id,
  }));
}

module.exports = { ...controladorCrud(config), listarPorTerreno };
