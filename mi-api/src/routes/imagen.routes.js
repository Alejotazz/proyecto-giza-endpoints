const express = require('express');
const router = express.Router();
const controlador = require('../controllers/imagen.controllers');

router.get('/terrenos/:id/imagenes', controlador.listarImagenes);
router.post('/terrenos/:id/imagenes', controlador.crearImagen);
router.put('/imagenes/:id', controlador.etiquetarImagen);

module.exports = router;