const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Entrenamiento.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { ROL_ADMIN } = require('../middleware/acceso.middleware');

const soloAdmin = verificarRol(ROL_ADMIN);

// Cualquier usuario con sesión puede consultar; solo el admin modifica
router.get('/entrenamientos', ctrl.listar);
router.get('/entrenamientos/:id', ctrl.obtener);
router.get('/modelos/:id_modelo/entrenamientos', ctrl.listarPorPadre);
router.post('/modelos/:id_modelo/entrenamientos', soloAdmin, ctrl.crear);
router.put('/entrenamientos/:id', soloAdmin, ctrl.actualizar);
router.delete('/entrenamientos/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
