const express = require('express');
const router = express.Router();
const controlador = require('../controllers/imagen.controllers');
const { TABLA, ID } = require('../models/imagen.models');
const { verificarAccesoTerreno, terrenoDeLaUrl, terrenoDeRegistro } = require('../middleware/acceso.middleware');

const accesoPorTerreno = verificarAccesoTerreno(terrenoDeLaUrl('id'));
const accesoPorImagen = verificarAccesoTerreno(terrenoDeRegistro(TABLA, ID), 'Imagen');

router.get('/terrenos/:id/imagenes', accesoPorTerreno, controlador.listarImagenes);
router.post('/terrenos/:id/imagenes', accesoPorTerreno, controlador.crearImagen);
router.put('/imagenes/:id', accesoPorImagen, controlador.etiquetarImagen);

module.exports = router;
