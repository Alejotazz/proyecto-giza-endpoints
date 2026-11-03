const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Evaluacion.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { ROL_ADMIN } = require('../middleware/acceso.middleware');

const soloAdmin = verificarRol(ROL_ADMIN);

// Cualquier usuario con sesión puede consultar; solo el admin modifica
router.get('/evaluaciones', ctrl.listar);
router.get('/evaluaciones/:id', ctrl.obtener);
router.get('/entrenamientos/:id_entrenamiento/evaluacion', ctrl.listarPorPadre);
router.post('/entrenamientos/:id_entrenamiento/evaluacion', soloAdmin, ctrl.crear);
router.put('/evaluaciones/:id', soloAdmin, ctrl.actualizar);
router.delete('/evaluaciones/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
