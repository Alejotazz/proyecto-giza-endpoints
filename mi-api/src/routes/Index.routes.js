const express = require('express');
const router = express.Router();

router.use(require('./dataset.routes'));
router.use(require('./modelo.routes'));
router.use(require('./Entrenamiento.routes'));
router.use(require('./Evaluacion.routes'));
router.use(require('./prediccion.routes'));
router.use(require('./Alerta.routes'));
router.use(require('./Retroalimentacion.routes'));

module.exports = router;