const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controllers');
const { verificarRol, verificarDuenoORol } = require('../middleware/auht.middleware');
const { verificarAccesoTerreno, terrenoDeLaUrl, ROL_ADMIN } = require('../middleware/acceso.middleware');

// El token ya lo exige app.js para todo este router (ver rutasProtegidas)
const soloAdmin = verificarRol(ROL_ADMIN);
const accesoTerreno = verificarAccesoTerreno(terrenoDeLaUrl('id'));

// Para registrarse se usa POST /api/auth/registro; aquí solo un admin crea usuarios
router.get('/usuarios', soloAdmin, controller.listUsuarios);
router.post('/usuarios', soloAdmin, controller.createUsuario);
router.get('/usuarios/:id', verificarDuenoORol(ROL_ADMIN), controller.getUsuario);
router.put('/usuarios/:id', verificarDuenoORol(ROL_ADMIN), controller.updateUsuario);
router.delete('/usuarios/:id', soloAdmin, controller.deleteUsuario);

router.get('/cultivos', controller.listCultivos);
router.post('/cultivos', soloAdmin, controller.createCultivo);
router.get('/cultivos/:id', controller.getCultivo);
router.put('/cultivos/:id', soloAdmin, controller.updateCultivo);
router.delete('/cultivos/:id', soloAdmin, controller.deleteCultivo);

// Ver quién está en un terreno: admin o usuarios de ese mismo terreno (antes: cualquiera)
router.get('/terrenos/:id/usuarios', accesoTerreno, controller.listUsuariosDeTerreno);
router.post('/terrenos/:id/usuarios', soloAdmin, accesoTerreno, controller.asignarUsuarioATerreno);
router.delete('/terrenos/:id/usuarios/:id_usuario', soloAdmin, accesoTerreno, controller.quitarUsuarioDeTerreno);

module.exports = router;
