const express = require('express');
const router = express.Router();
const controlador = require('../controllers/cosecha.controllers');
const { TABLA, ID } = require('../models/cosecha.models');
const { verificarAccesoTerreno, terrenoDeLaUrl, terrenoDeRegistro } = require('../middleware/acceso.middleware');

// Solo el admin o usuarios asignados al terreno de la cosecha
const accesoPorTerreno = verificarAccesoTerreno(terrenoDeLaUrl('id'));
const accesoPorCosecha = verificarAccesoTerreno(terrenoDeRegistro(TABLA, ID), 'Cosecha');

router.get('/terrenos/:id/cosechas', accesoPorTerreno, controlador.listarCosechas);
router.post('/terrenos/:id/cosechas', accesoPorTerreno, controlador.crearCosecha);
router.get('/cosechas/:id', accesoPorCosecha, controlador.obtenerCosecha);
router.put('/cosechas/:id', accesoPorCosecha, controlador.actualizarCosecha);
router.delete('/cosechas/:id', accesoPorCosecha, controlador.eliminarCosecha);

module.exports = router;
