const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const parcelaDatosController = require("../controllers/parcela-datos.controller");

router.post("/:id/imagenes", upload.single("imagen"), parcelaDatosController.subirImagen);

module.exports = router;