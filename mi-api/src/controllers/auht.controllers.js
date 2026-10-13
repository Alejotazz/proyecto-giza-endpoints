const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authModel = require('../models/auht.models');

const SALT_ROUNDS = 10;

function generarToken(usuario) {
  return jwt.sign(
    { id_usuario: usuario.id_usuario, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h', algorithm: 'HS256' }
  );
}

// POST /api/auth/registro
async function registrar(req, res, next) {
  try {
    const { nombre, correo, password, telefono } = req.body || {};
    if (!nombre || !correo || !password) {
      return res.status(400).json({ mensaje: 'nombre, correo y password son obligatorios' });
    }
    if (password.length < 6) {
      return res.status(400).json({ mensaje: 'El password debe tener al menos 6 caracteres' });
    }

    const existente = await authModel.findByCorreo(correo);
    if (existente) {
      return res.status(409).json({ mensaje: 'El correo ya está registrado' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    // El rol NO se toma del body: un registro público siempre crea un 'agricultor'.
    // Los roles los asigna un admin desde /api/usuarios.
    const usuario = await authModel.create({ nombre, correo, password: hash, telefono });

    res.status(201).json({ usuario, token: generarToken(usuario) });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { correo, password } = req.body || {};
    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'correo y password son obligatorios' });
    }

    const usuario = await authModel.findByCorreo(correo);
    const passwordOk = usuario && (await bcrypt.compare(password, usuario.password));
    if (!passwordOk) {
      // Mismo mensaje para correo y password: no revela qué correos existen
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    await authModel.actualizarUltimoLogin(usuario.id_usuario);

    const { password: _omitido, ...usuarioSinPassword } = usuario;
    res.json({ usuario: usuarioSinPassword, token: generarToken(usuario) });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/perfil  (requiere token)
async function perfil(req, res, next) {
  try {
    const usuario = await authModel.findById(req.usuario.id_usuario);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/conectados  (requiere token)
async function usuariosConectados(req, res, next) {
  try {
    const usuarios = await authModel.getUsuariosConectados();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

module.exports = { registrar, login, perfil, usuariosConectados };
