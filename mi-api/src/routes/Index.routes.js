const express = require('express');
const router = express.Router();

router.use(require('./Dataset.routes'));
router.use(require('./Modelo.routes'));
router.use(require('./Entrenamiento.routes'));
router.use(require('./Evaluacion.routes'));
router.use(require('./Alerta.routes'));
router.use(require('./Retroalimentacion.routes'));

module.exports = router;
