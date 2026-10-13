const express = require('express');
const router = express.Router();
const parcelaController = require('../controllers/parcela.controllers');

// El token ya lo exige app.js para todo este router (ver rutasProtegidas)
router.post('/', parcelaController.crearParcela);
router.get('/', parcelaController.listarParcelas);
router.get('/:id', parcelaController.obtenerParcela);
router.put('/:id', parcelaController.editarParcela);
router.delete('/:id', parcelaController.eliminarParcela);

module.exports = router;
