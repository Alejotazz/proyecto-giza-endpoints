const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Retroalimentacion.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { ROL_ADMIN } = require('../middleware/acceso.middleware');

// Comparación predicción vs. cosecha real, usada para reentrenar: solo admin
router.use('/retroalimentacion', verificarRol(ROL_ADMIN));

router.get('/retroalimentacion', ctrl.listar);
router.get('/retroalimentacion/:id', ctrl.obtener);
router.post('/retroalimentacion', ctrl.crear);
router.put('/retroalimentacion/:id', ctrl.actualizar);
router.delete('/retroalimentacion/:id', ctrl.eliminar);

module.exports = router;
