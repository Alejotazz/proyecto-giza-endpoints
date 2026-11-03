const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/Alerta.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { ROL_ADMIN } = require('../middleware/acceso.middleware');

// TODO: las alertas cuelgan de una predicción (tabla predicciones). Cuando se sepa
// cómo se une una predicción con su terreno, abrir la lectura a los usuarios de ese
// terreno con verificarAccesoTerreno. Mientras tanto, solo el admin, para que nadie
// vea alertas de terrenos ajenos.
router.use(['/alertas', '/predicciones'], verificarRol(ROL_ADMIN));

router.get('/alertas', ctrl.listar);
router.get('/alertas/:id', ctrl.obtener);
router.get('/predicciones/:id_prediccion/alertas', ctrl.listarPorPadre);
router.post('/predicciones/:id_prediccion/alertas', ctrl.crear);
router.put('/alertas/:id/leida', ctrl.marcarLeida);
router.delete('/alertas/:id', ctrl.eliminar);

module.exports = router;
