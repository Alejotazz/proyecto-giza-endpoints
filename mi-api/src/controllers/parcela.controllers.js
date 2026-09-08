const Parcela = require('../models/Parcela');

exports.crearParcela = async (req, res) => {
  try {
    const { nombre, cultivo, geometria } = req.body;
    const parcela = await Parcela.create({ nombre, cultivo, geometria, usuarioId: req.usuario.id });
    res.status(201).json(parcela);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};