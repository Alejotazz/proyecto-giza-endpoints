const express = require('express');
const app = express();

app.use(express.json());

const usuariosRoutes = require('./usuarios.routes'); 
app.use('/', usuariosRoutes);


app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;