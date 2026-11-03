const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Dataset.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { verificarAccesoTerreno, terrenoDeLaUrl, ROL_ADMIN } = require('../middleware/acceso.middleware');

const soloAdmin = verificarRol(ROL_ADMIN);

// Datos de entrenamiento: el admin gestiona todo; un usuario solo lee los de sus terrenos
router.get('/dataset', soloAdmin, ctrl.listar);
router.get('/dataset/:id', soloAdmin, ctrl.obtener);
router.get('/terrenos/:id_terreno/dataset', verificarAccesoTerreno(terrenoDeLaUrl('id_terreno')), ctrl.listarPorTerreno);
router.post('/dataset', soloAdmin, ctrl.crear);
router.put('/dataset/:id', soloAdmin, ctrl.actualizar);
router.delete('/dataset/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
