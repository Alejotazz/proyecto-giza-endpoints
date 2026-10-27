const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middleware/auht.middleware');
const ctrl = require('../controllers/Retroalimentacion.controllers');

router.get('/retroalimentacion', ctrl.getAllRetroalimentacion);
router.get('/retroalimentacion/:id', ctrl.getRetroalimentacionById);
router.post('/retroalimentacion', ctrl.createRetroalimentacion);
router.put('/retroalimentacion/:id', ctrl.updateRetroalimentacion);
router.delete('/retroalimentacion/:id', verificarRol('administrador'), ctrl.deleteRetroalimentacion);

module.exports = router;