const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/modelo.controller');

router.get('/modelos', ctrl.getAllModelos);
router.get('/modelos/:id', ctrl.getModeloById);
router.post('/modelos', ctrl.createModelo);
router.put('/modelos/:id', ctrl.updateModelo);
router.delete('/modelos/:id', ctrl.deleteModelo);

module.exports = router;