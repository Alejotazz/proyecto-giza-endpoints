const pool = require('../../config/db');
const { HttpError, noEncontrado } = require('../utils/errores');
const { validarId } = require('../utils/validar');

const ROL_ADMIN = 'administrador';

const esAdmin = (req) => req.usuario && req.usuario.rol === ROL_ADMIN;

// ¿El usuario está asignado a ese terreno (tabla terrenos_usuarios)?
async function tieneAccesoATerreno(idUsuario, idTerreno) {
  const [rows] = await pool.query(
    'SELECT 1 FROM terrenos_usuarios WHERE id_terreno = ? AND id_usuario = ? LIMIT 1',
    [idTerreno, idUsuario]
  );
  return rows.length > 0;
}

// Middleware: deja pasar al admin o a un usuario asignado al terreno.
// "obtenerIdTerreno(req)" devuelve el id del terreno al que pertenece el recurso:
//   - rutas /terrenos/:id/...  -> el :id de la URL
//   - rutas /cosechas/:id      -> se busca el id_terreno de esa cosecha
// Si el recurso no existe responde 404 (también al admin).
function verificarAccesoTerreno(obtenerIdTerreno, que = 'Terreno') {
  return async (req, res, next) => {
    const idTerreno = await obtenerIdTerreno(req);
    if (idTerreno === null || idTerreno === undefined) throw noEncontrado(que);
    req.idTerreno = idTerreno;
    if (esAdmin(req)) return next();
    if (await tieneAccesoATerreno(req.usuario.id_usuario, idTerreno)) return next();
    throw new HttpError(403, 'No tienes acceso a este terreno');
  };
}

// Helpers para obtenerIdTerreno
const terrenoDeLaUrl = (param = 'id') => async (req) => {
  const id = validarId(req.params[param], param);
  const [rows] = await pool.query('SELECT id_terreno FROM terrenos WHERE id_terreno = ?', [id]);
  return rows[0] ? rows[0].id_terreno : null;
};

const terrenoDeRegistro = (tabla, columnaId, param = 'id') => async (req) => {
  const id = validarId(req.params[param], param);
  const [rows] = await pool.query(`SELECT id_terreno FROM ${tabla} WHERE ${columnaId} = ?`, [id]);
  return rows[0] ? rows[0].id_terreno : null;
};

module.exports = {
  ROL_ADMIN,
  esAdmin,
  tieneAccesoATerreno,
  verificarAccesoTerreno,
  terrenoDeLaUrl,
  terrenoDeRegistro,
};
