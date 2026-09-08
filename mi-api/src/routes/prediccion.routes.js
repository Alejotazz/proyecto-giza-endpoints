const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const parcelaDatosController = require("../controllers/parcela-datos.controller");

// POST /parcelas/:id/imagenes  (form-data, campo "imagen")
router.post("/:id/imagenes", upload.single("imagen"), parcelaDatosController.subirImagen);

module.exports = router;