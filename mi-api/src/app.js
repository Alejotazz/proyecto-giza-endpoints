const express = require('express');
const { verificarToken } = require('./middleware/auht.middleware');
const { rutaNoEncontrada, manejarErrores } = require('./middleware/error.middleware');

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// ===== RUTAS PÚBLICAS =====
// Deben ir ANTES de las protegidas: /api/auth/registro y /api/auth/login no piden token
app.use('/api', require('./routes/auht.routes'));

// ===== RUTAS PROTEGIDAS =====
// verificarToken se aplica una sola vez a todo lo que cuelga de este router
const rutasProtegidas = express.Router();
rutasProtegidas.use(verificarToken);

rutasProtegidas.use(require('./routes/usuarios.routes'));
rutasProtegidas.use(require('./routes/terreno.routes'));
rutasProtegidas.use(require('./routes/clima.routes'));
rutasProtegidas.use(require('./routes/cosecha.routes'));
rutasProtegidas.use(require('./routes/imagen.routes'));
rutasProtegidas.use(require('./routes/muestrasuelo.routes'));
rutasProtegidas.use(require('./routes/Index.routes')); // dataset, modelos, entrenamientos, evaluaciones, alertas, retroalimentación

// TODO: parcela.routes usa Sequelize (models/parcela.models.js) y prediccion.routes usa multer;
// ninguno está instalado ni configurado. Montarlos cuando se pasen a mysql2 como el resto:
// rutasProtegidas.use('/parcelas', require('./routes/parcela.routes'));
// rutasProtegidas.use('/parcelas', require('./routes/prediccion.routes'));

app.use('/api', rutasProtegidas);

// ===== MANEJO DE ERRORES (siempre al final) =====
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
