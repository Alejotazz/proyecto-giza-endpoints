const express = require('express');
const router = express.Router();
const { verificarRol } = require('../middleware/auht.middleware');
const ctrl = require('../controllers/Entrenamiento.controllers');

router.get('/entrenamientos', ctrl.getAllEntrenamientos);
router.get('/entrenamientos/:id', ctrl.getEntrenamientoById);
router.get('/modelos/:id_modelo/entrenamientos', ctrl.getEntrenamientosByModelo);
router.post('/modelos/:id_modelo/entrenamientos', ctrl.createEntrenamiento);
router.put('/entrenamientos/:id', ctrl.updateEntrenamiento);
router.delete('/entrenamientos/:id', verificarRol('administrador'), ctrl.deleteEntrenamiento);

module.exports = router;