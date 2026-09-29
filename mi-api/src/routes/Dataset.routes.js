const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dataset.controller');

router.get('/dataset', ctrl.getAllDataset);
router.get('/dataset/:id', ctrl.getDatasetById);
router.get('/terrenos/:id_terreno/dataset', ctrl.getDatasetByTerreno);
router.post('/dataset', ctrl.createDataset);
router.put('/dataset/:id', ctrl.updateDataset);
router.delete('/dataset/:id', ctrl.deleteDataset);

module.exports = router;