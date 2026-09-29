const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/evaluacion.controller');

router.get('/evaluaciones', ctrl.getAllEvaluaciones);
router.get('/evaluaciones/:id', ctrl.getEvaluacionById);
router.get('/entrenamientos/:id_entrenamiento/evaluacion', ctrl.getEvaluacionesByEntrenamiento);
router.post('/entrenamientos/:id_entrenamiento/evaluacion', ctrl.createEvaluacion);
router.put('/evaluaciones/:id', ctrl.updateEvaluacion);
router.delete('/evaluaciones/:id', ctrl.deleteEvaluacion);

module.exports = router;