const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/retroalimentacion.controller');

router.get('/retroalimentacion', ctrl.getAllRetroalimentacion);
router.get('/retroalimentacion/:id', ctrl.getRetroalimentacionById);
router.post('/retroalimentacion', ctrl.createRetroalimentacion);
router.put('/retroalimentacion/:id', ctrl.updateRetroalimentacion);
router.delete('/retroalimentacion/:id', ctrl.deleteRetroalimentacion);

module.exports = router;