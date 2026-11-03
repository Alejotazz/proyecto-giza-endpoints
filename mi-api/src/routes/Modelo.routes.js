const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Modelo.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { ROL_ADMIN } = require('../middleware/acceso.middleware');

const soloAdmin = verificarRol(ROL_ADMIN);

// Cualquier usuario con sesión puede consultar; solo el admin modifica
router.get('/modelos', ctrl.listar);
router.get('/modelos/:id', ctrl.obtener);
router.post('/modelos', soloAdmin, ctrl.crear);
router.put('/modelos/:id', soloAdmin, ctrl.actualizar);
router.delete('/modelos/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
