const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controllers');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', controller.resetPassword);
router.get('/perfil', controller.getPerfil);
router.put('/perfil', controller.updatePerfil);
router.put('/preferencias-notificacion', controller.updatePreferenciasNotificacion);

module.exports = router;