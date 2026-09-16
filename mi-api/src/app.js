
const express = require('express');
const app = express();

app.use(express.json());


const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);


const parcelaRoutes = require('./routes/parcela.routes');
app.use('/parcelas', parcelaRoutes);

<<<<<<< HEAD
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
=======
const prediccionroutes= require("./routes/prediccion.routes")
app.use("/prediccion", prediccionroutes);

const prediccionRoutes = require('./routes/Index.routes'); 
app.use('/api', prediccionRoutes);
>>>>>>> d8ec066d7fcb062036105ad865d3dadd36f954c3
