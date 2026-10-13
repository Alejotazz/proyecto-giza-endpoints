const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controllers');
const { verificarRol, verificarDuenoORol } = require('../middleware/auht.middleware');

// El token ya lo exige app.js para todo este router (ver rutasProtegidas)

// Para registrarse se usa POST /api/auth/registro; aquí solo un admin crea usuarios
router.get('/usuarios', verificarRol('administrador'), controller.listUsuarios);
router.post('/usuarios', verificarRol('administrador'), controller.createUsuario);
router.get('/usuarios/:id', verificarDuenoORol('administrador'), controller.getUsuario);
router.put('/usuarios/:id', verificarDuenoORol('administrador'), controller.updateUsuario);
router.delete('/usuarios/:id', verificarRol('administrador'), controller.deleteUsuario);

router.get('/cultivos', controller.listCultivos);
router.post('/cultivos', verificarRol('administrador'), controller.createCultivo);
router.get('/cultivos/:id', controller.getCultivo);
router.put('/cultivos/:id', verificarRol('administrador'), controller.updateCultivo);
router.delete('/cultivos/:id', verificarRol('administrador'), controller.deleteCultivo);

router.get('/terrenos/:id/usuarios', controller.listUsuariosDeTerreno);
router.post('/terrenos/:id/usuarios', verificarRol('administrador'), controller.asignarUsuarioATerreno);
router.delete('/terrenos/:id/usuarios/:id_usuario', verificarRol('administrador'), controller.quitarUsuarioDeTerreno);

module.exports = router;
