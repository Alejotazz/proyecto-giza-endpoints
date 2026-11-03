const express = require('express');
const router = express.Router();
const controlador = require('../controllers/muestrasuelo.controllers');
const { verificarAccesoTerreno, terrenoDeLaUrl } = require('../middleware/acceso.middleware');

const acceso = verificarAccesoTerreno(terrenoDeLaUrl('id'));

router.get('/terrenos/:id/muestras-suelo', acceso, controlador.listarMuestrasSuelo);
router.post('/terrenos/:id/muestras-suelo', acceso, controlador.crearMuestraSuelo);

module.exports = router;
