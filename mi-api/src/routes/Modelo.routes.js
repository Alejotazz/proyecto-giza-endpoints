const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middleware/auht.middleware');
const ctrl = require('../controllers/Modelo.controllers');

router.get('/modelos', ctrl.getAllModelos);
router.get('/modelos/:id', ctrl.getModeloById);
router.post('/modelos', ctrl.createModelo);
router.put('/modelos/:id', ctrl.updateModelo);
router.delete('/modelos/:id', verificarRol('administrador'), ctrl.deleteModelo);

module.exports = router;