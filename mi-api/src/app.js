const express = require('express');
const app = express();
 
app.use(express.json());
 

const usuariosRoutes = require('./routes/usuarios.routes');
app.use('/api/usuarios', usuariosRoutes);
 

const terrenoRoutes = require('./routes/terreno.routes');
const imagenRoutes = require('./routes/imagen.routes');
const muestraSueloRoutes = require('./routes/muestraSuelo.routes');
const climaRoutes = require('./routes/clima.routes');
const cosechaRoutes = require('./routes/cosecha.routes');
 
app.use('/api', terrenoRoutes);
app.use('/api', imagenRoutes);
app.use('/api', muestraSueloRoutes);
app.use('/api', climaRoutes);
app.use('/api', cosechaRoutes);
 

const prediccionroutes = require("./routes/prediccion.routes");
app.use("/prediccion", prediccionroutes);
 
module.exports = app;