const parcelaDatos = require("../models/parcela-datos.models");

function subirImagen(req, res) {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo (campo 'imagen')" });
  }

  const imagen = parcelaDatos.agregarImagen(id, req.file);
  return res.status(201).json({ mensaje: "Imagen subida correctamente", imagen });
}

module.exports = { subirImagen };