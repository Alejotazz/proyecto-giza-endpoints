const express = require('express');
const router = express.Router();
const controlador = require('../controllers/terreno.controllers');

router.get('/terrenos', controlador.listarTerrenos);
router.post('/terrenos', controlador.crearTerreno);
router.get('/terrenos/:id', controlador.obtenerTerreno);
router.put('/terrenos/:id', controlador.actualizarTerreno);
router.delete('/terrenos/:id', controlador.eliminarTerreno);

module.exports = router;