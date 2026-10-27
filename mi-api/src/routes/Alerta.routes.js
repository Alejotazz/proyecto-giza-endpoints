const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middleware/auht.middleware');
const ctrl = require('../controllers/Alerta.controllers');

router.get('/alertas', ctrl.getAllAlertas);
router.get('/alertas/:id', ctrl.getAlertaById);
router.get('/predicciones/:id_prediccion/alertas', ctrl.getAlertasByPrediccion);
router.post('/predicciones/:id_prediccion/alertas', ctrl.createAlerta);
router.put('/alertas/:id/leida', ctrl.marcarAlertaLeida);
router.delete('/alertas/:id', verificarRol('administrador'), ctrl.deleteAlerta);

module.exports = router;