const jwt = require('jsonwebtoken');
const pool = require('../../config/db');

if (!process.env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

// Verifica que la petición traiga un token válido en el header:
//   Authorization: Bearer <token>
// Además vuelve a leer al usuario de la BD, para que un usuario borrado o al que
// le cambiaron el rol no siga usando los permisos viejos del token.
// Si todo es válido, guarda { id_usuario, correo, rol } en req.usuario y deja pasar.
async function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (!tipo || tipo.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    const mensaje = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return res.status(401).json({ mensaje });
  }

  const [rows] = await pool.query(
    'SELECT id_usuario, correo, rol FROM usuarios WHERE id_usuario = ?',
    [payload.id_usuario]
  );
  if (!rows[0]) {
    return res.status(401).json({ mensaje: 'El usuario del token ya no existe' });
  }

  req.usuario = rows[0];
  next();
}

// Permite el paso solo a los roles indicados. Se usa DESPUÉS de verificarToken.
//   router.delete('/:id', verificarRol('administrador'), controller.eliminar);
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

// Permite el paso si el usuario es dueño del recurso (:id de la URL) o tiene uno de los roles indicados.
//   router.put('/usuarios/:id', verificarDuenoORol('administrador'), controller.actualizar);
function verificarDuenoORol(...rolesPermitidos) {
  return (req, res, next) => {
    const esDueno = req.usuario && String(req.usuario.id_usuario) === String(req.params.id);
    const tieneRol = req.usuario && rolesPermitidos.includes(req.usuario.rol);
    if (!esDueno && !tieneRol) {
      return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

module.exports = { verificarToken, verificarRol, verificarDuenoORol };
