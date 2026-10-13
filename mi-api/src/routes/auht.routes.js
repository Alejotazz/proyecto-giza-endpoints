const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auht.controllers');
const { verificarToken, verificarRol } = require('../middleware/auht.middleware');

// ===== RUTAS PÚBLICAS (cualquiera puede entrar, no piden token) =====
router.post('/auth/registro', ctrl.registrar);
router.post('/auth/login', ctrl.login);

// ===== RUTAS PRIVADAS (exigen token válido) =====
router.get('/auth/perfil', verificarToken, ctrl.perfil);
// Expone correos de otros usuarios: solo admin
router.get('/auth/conectados', verificarToken, verificarRol('admin'), ctrl.usuariosConectados);

module.exports = router;
