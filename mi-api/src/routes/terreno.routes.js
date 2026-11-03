const express = require('express');
const router = express.Router();
const controlador = require('../controllers/terreno.controllers');
const { verificarRol } = require('../middleware/auht.middleware');
const { verificarAccesoTerreno, terrenoDeLaUrl, ROL_ADMIN } = require('../middleware/acceso.middleware');

// El token ya lo exige app.js. Un usuario solo ve/edita los terrenos a los que está
// asignado (terrenos_usuarios); crear y borrar terrenos es solo para el admin, que
// después asigna usuarios con POST /terrenos/:id/usuarios.
const acceso = verificarAccesoTerreno(terrenoDeLaUrl('id'));

router.get('/terrenos', controlador.listarTerrenos);
router.post('/terrenos', verificarRol(ROL_ADMIN), controlador.crearTerreno);
router.get('/terrenos/:id', acceso, controlador.obtenerTerreno);
router.put('/terrenos/:id', acceso, controlador.actualizarTerreno);
router.delete('/terrenos/:id', verificarRol(ROL_ADMIN), controlador.eliminarTerreno);

module.exports = router;
