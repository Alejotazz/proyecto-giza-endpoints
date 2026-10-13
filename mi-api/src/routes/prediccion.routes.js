const express = require("express");
const router = express.Router();

const parcelaDatosController = require("../controllers/prediccion.controllers");

// POST /parcelas/:id/imagenes  (form-data, campo "imagen")
router.post("/:id/imagenes", upload.single("imagen"), parcelaDatosController.subirImagen);

module.exports = router;    