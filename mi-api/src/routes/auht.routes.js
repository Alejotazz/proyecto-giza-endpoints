const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auht.controllers');
const { verificarToken } = require('../middleware/auht.middleware');

// ===== RUTAS PÚBLICAS (cualquiera puede entrar, no piden token) =====
router.post('/auth/registro', ctrl.registrar);
router.post('/auth/login', ctrl.login);

// ===== RUTAS PRIVADAS (exigen token válido) =====
router.get('/auth/perfil', verificarToken, ctrl.perfil);
router.get('/auth/conectados', verificarToken, ctrl.usuariosConectados);

module.exports = router;
