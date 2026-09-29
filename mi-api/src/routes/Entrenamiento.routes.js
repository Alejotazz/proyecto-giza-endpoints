const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/entrenamiento.controller');

router.get('/entrenamientos', ctrl.getAllEntrenamientos);
router.get('/entrenamientos/:id', ctrl.getEntrenamientoById);
router.get('/modelos/:id_modelo/entrenamientos', ctrl.getEntrenamientosByModelo);
router.post('/modelos/:id_modelo/entrenamientos', ctrl.createEntrenamiento);
router.put('/entrenamientos/:id', ctrl.updateEntrenamiento);
router.delete('/entrenamientos/:id', ctrl.deleteEntrenamiento);

module.exports = router;