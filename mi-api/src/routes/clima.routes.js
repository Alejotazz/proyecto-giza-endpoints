const express = require('express');
const router = express.Router();
const controlador = require('../controllers/clima.controllers');

router.get('/terrenos/:id/clima', controlador.listarClima);
router.post('/terrenos/:id/clima', controlador.crearDatoClima);

module.exports = router;