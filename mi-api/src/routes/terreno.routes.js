const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middleware/auht.middleware');
const controlador = require('../controllers/terreno.controllers');

router.get('/terrenos', controlador.listarTerrenos);
router.post('/terrenos', controlador.crearTerreno);
router.get('/terrenos/:id', controlador.obtenerTerreno);
router.put('/terrenos/:id', controlador.actualizarTerreno);
router.delete('/terrenos/:id', verificarRol('administrador'), controlador.eliminarTerreno);

module.exports = router;