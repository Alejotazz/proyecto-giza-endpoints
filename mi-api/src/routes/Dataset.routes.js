const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Dataset.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { verificarAccesoTerreno, terrenoDeLaUrl, ROL_ADMIN } = require('../middleware/acceso.middleware');

const soloAdmin = verificarRol(ROL_ADMIN);
const lecturaGeneral = verificarRol(ROL_ADMIN, 'investigador');

// Datos de entrenamiento: el admin gestiona todo; el investigador puede leerlos todos;
// los demás usuarios solo leen los de sus terrenos
router.get('/dataset', lecturaGeneral, ctrl.listar);
router.get('/dataset/:id', lecturaGeneral, ctrl.obtener);
router.get('/terrenos/:id_terreno/dataset', verificarAccesoTerreno(terrenoDeLaUrl('id_terreno')), ctrl.listarPorTerreno);
router.post('/dataset', soloAdmin, ctrl.crear);
router.put('/dataset/:id', soloAdmin, ctrl.actualizar);
router.delete('/dataset/:id', soloAdmin, ctrl.eliminar);

module.exports = router;
