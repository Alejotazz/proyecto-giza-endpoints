
const express = require('express');
const app = express();

app.use(express.json());


const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);


const parcelaRoutes = require('./routes/parcela.routes');
app.use('/parcelas', parcelaRoutes);

const prediccionRoutes = require('./routes/prediccion.routes');
app.use('/prediccion', prediccionRoutes);


app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;