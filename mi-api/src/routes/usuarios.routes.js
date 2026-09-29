const express = require('express');
const router = express.Router();
const controller = require('./usuarios.controllers')

router.get('/usuarios', controller.listUsuarios);
router.post('/usuarios', controller.createUsuario);
router.get('/usuarios/:id', controller.getUsuario);
router.put('/usuarios/:id', controller.updateUsuario);
router.delete('/usuarios/:id', controller.deleteUsuario);

router.get('/cultivos', controller.listCultivos);
router.post('/cultivos', controller.createCultivo);
router.get('/cultivos/:id', controller.getCultivo);
router.put('/cultivos/:id', controller.updateCultivo);
router.delete('/cultivos/:id', controller.deleteCultivo);

router.get('/terrenos/:id/usuarios', controller.listUsuariosDeTerreno);
router.post('/terrenos/:id/usuarios/:id_usuario', controller.asignarUsuarioATerreno);
router.delete('/terrenos/:id/usuarios/:id_usuario', controller.quitarUsuarioDeTerreno);

module.exports = router;