const express = require('express');
const router = express.Router();
const controlador = require('../controllers/cosecha.controllers');

router.get('/terrenos/:id/cosechas', controlador.listarCosechas);
router.post('/terrenos/:id/cosechas', controlador.crearCosecha);
router.get('/cosechas/:id', controlador.obtenerCosecha);
router.put('/cosechas/:id', controlador.actualizarCosecha);
router.delete('/cosechas/:id', controlador.eliminarCosecha);

module.exports = router;
