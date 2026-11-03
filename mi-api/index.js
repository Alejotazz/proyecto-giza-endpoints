require('dotenv').config();
const app = require('./src/app');

// 3000 por defecto: 3306 es el puerto de MySQL y chocaba con la base de datos
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
