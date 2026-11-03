const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const pool = require('../config/db');
const { verificarToken } = require('./middleware/auht.middleware');
const { rutaNoEncontrada, manejarErrores } = require('./middleware/error.middleware');

const app = express();

// Orígenes permitidos: CORS_ORIGINS en .env (separados por coma) o el front de Vite en local
const origenes = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: origenes,
  allowedHeaders: ['Content-Type', 'Authorization'], // array: con paréntesis solo quedaba 'Authorization'
}));
app.use(express.json({ limit: '1mb' }));

// ===== SALUD =====
// GET /api/salud -> 200 si la API y la base de datos responden, 503 si la BD no
app.get('/api/salud', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok', baseDeDatos: 'ok' });
  } catch {
    res.status(503).json({ estado: 'error', baseDeDatos: 'sin conexión' });
  }
});

// ===== RUTAS PÚBLICAS =====
// Límite de intentos para login/registro (contra fuerza bruta): 20 por IP cada 15 minutos
const limiteAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT) || 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { mensaje: 'Demasiados intentos. Vuelve a intentarlo en unos minutos.' },
});
app.use('/api/auth/login', limiteAuth);
app.use('/api/auth/registro', limiteAuth);

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
// ninguno está instalado ni configurado, y hoy esos archivos fallan al cargarse.
// Montarlos solo cuando se pasen a mysql2 como el resto:
// rutasProtegidas.use('/parcelas', require('./routes/parcela.routes'));
// rutasProtegidas.use('/parcelas', require('./routes/prediccion.routes'));

app.use('/api', rutasProtegidas);

// ===== MANEJO DE ERRORES (siempre al final) =====
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;
