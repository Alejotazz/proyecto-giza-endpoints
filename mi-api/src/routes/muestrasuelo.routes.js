const express = require('express');
const router = express.Router();
const controlador = require('../controllers/muestrasuelo.controllers');

router.get('/terrenos/:id/muestras-suelo', controlador.listarMuestrasSuelo);
router.post('/terrenos/:id/muestras-suelo', controlador.crearMuestraSuelo);

module.exports = router;
