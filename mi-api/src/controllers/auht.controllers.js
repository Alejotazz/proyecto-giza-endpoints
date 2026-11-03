const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auht.models');
const { validarCorreo, validarPassword, validarTexto } = require('../utils/usuarios.validacion');
const { HttpError } = require('../utils/errores');

const SALT_ROUNDS = 10;

// Hash de relleno: si el correo no existe igual se ejecuta un bcrypt.compare,
// así el tiempo de respuesta no revela qué correos están registrados.
const HASH_RELLENO = bcrypt.hashSync('relleno-para-tiempo-constante', SALT_ROUNDS);

function generarToken(usuario) {
  return jwt.sign(
    { id_usuario: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h', algorithm: 'HS256' }
  );
}

// POST /api/auth/registro
async function registrar(req, res) {
  const body = req.body || {};
  const nombre = validarTexto(body.nombre, 'nombre', { requerido: true });
  const correo = validarCorreo(body.correo);
  const password = validarPassword(body.password);
  const telefono = validarTexto(body.telefono, 'telefono', { maxLargo: 30 });

  if (await authModel.findByCorreo(correo)) {
    throw new HttpError(409, 'El correo ya está registrado');
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  // El rol NO se toma del body: un registro público siempre crea un 'agricultor'.
  // Los roles los asigna un admin desde /api/usuarios.
  const usuario = await authModel.create({ nombre, correo, password: hash, telefono });

  res.status(201).json({ usuario, token: generarToken(usuario) });
}

// POST /api/auth/login
async function login(req, res) {
  const { correo, password } = req.body || {};
  if (typeof correo !== 'string' || typeof password !== 'string' || !correo || !password) {
    return res.status(400).json({ mensaje: 'correo y password son obligatorios' });
  }

  const usuario = await authModel.findByCorreo(correo.trim().toLowerCase());
  // Usuarios creados antes de la migración pueden no tener password: cuentan como credenciales inválidas
  const hashGuardado = usuario && typeof usuario.password === 'string' && usuario.password ? usuario.password : null;
  const passwordOk = await bcrypt.compare(password, hashGuardado || HASH_RELLENO);

  if (!hashGuardado || !passwordOk) {
    // Mismo mensaje para correo y password: no revela qué correos existen
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  await authModel.actualizarUltimoLogin(usuario.id_usuario);

  const { password: _omitido, ...usuarioSinPassword } = usuario;
  res.json({ usuario: usuarioSinPassword, token: generarToken(usuario) });
}

// GET /api/auth/perfil  (requiere token)
async function perfil(req, res) {
  const usuario = await authModel.findById(req.usuario.id_usuario);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
}

// GET /api/auth/conectados  (requiere token de admin)
async function usuariosConectados(req, res) {
  res.json(await authModel.getUsuariosConectados());
}

module.exports = { registrar, login, perfil, usuariosConectados };
