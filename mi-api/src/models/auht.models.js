const pool = require('../../config/db');

// Busca un usuario por correo (para login y para validar que no exista al registrar)
const findByCorreo = async (correo) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE correo = ?',
    [correo]
  );
  return rows[0];
};

const findById = async (id_usuario) => {
  const [rows] = await pool.query(
    'SELECT id_usuario, nombre, correo, telefono, rol, fecha_registro FROM usuarios WHERE id_usuario = ?',
    [id_usuario]
  );
  return rows[0];
};

// Crea el usuario con el password YA hasheado (el hash se hace en el controller)
const create = async ({ nombre, correo, password, telefono, rol }) => {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, correo, password, telefono, rol)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, correo, password, telefono || null, rol || 'agricultor']
  );
  return {
    id_usuario: result.insertId,
    nombre,
    correo,
    telefono: telefono || null,
    rol: rol || 'agricultor'
  };
};

// Lista de usuarios ya logueados (conectados) según su último login registrado
const getUsuariosConectados = async () => {
  const [rows] = await pool.query(
    `SELECT id_usuario, nombre, correo, rol, ultimo_login
     FROM usuarios
     WHERE ultimo_login IS NOT NULL
     ORDER BY ultimo_login DESC`
  );
  return rows;
};

const actualizarUltimoLogin = async (id_usuario) => {
  await pool.query(
    'UPDATE usuarios SET ultimo_login = NOW() WHERE id_usuario = ?',
    [id_usuario]
  );
};

module.exports = {
  findByCorreo,
  findById,
  create,
  getUsuariosConectados,
  actualizarUltimoLogin
};
