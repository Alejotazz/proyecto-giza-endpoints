const express = require('express');
const router = express.Router();
const controlador = require('../controllers/clima.controllers');
const { verificarAccesoTerreno, terrenoDeLaUrl } = require('../middleware/acceso.middleware');

const acceso = verificarAccesoTerreno(terrenoDeLaUrl('id'));

router.get('/terrenos/:id/clima', acceso, controlador.listarClima);
router.post('/terrenos/:id/clima', acceso, controlador.crearDatoClima);

module.exports = router;
