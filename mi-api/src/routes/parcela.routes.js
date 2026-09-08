const express = require('express');
const router = express.Router();
const parcelaController = require('../controllers/parcelaController');
const auth = require('../middlewares/auth'); // el middleware de Persona 1

router.post('/', auth, parcelaController.crearParcela);
router.get('/', auth, parcelaController.listarParcelas);
router.get('/:id', auth, parcelaController.obtenerParcela);
router.put('/:id', auth, parcelaController.editarParcela);
router.delete('/:id', auth, parcelaController.eliminarParcela);

module.exports = router;