const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en el archivo .env');
}

// Verifica que la petición traiga un token válido en el header:
//   Authorization: Bearer <token>
// Si es válido, guarda los datos del usuario en req.usuario y deja pasar.
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [tipo, token] = authHeader.split(' ');

  if (!tipo || tipo.toLowerCase() !== 'bearer' || !token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.usuario = payload; // { id_usuario, correo, rol }
    next();
  } catch (error) {
    const mensaje = error.name === 'TokenExpiredError' ? 'Token expirado' : 'Token inválido';
    return res.status(401).json({ mensaje });
  }
}

// Permite el paso solo a los roles indicados. Se usa DESPUÉS de verificarToken.
//   router.delete('/:id', verificarToken, verificarRol('administrador'), controller.eliminar);
function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
    }
    next();
  };
}

// Permite el paso si el usuario es dueño del recurso (:id de la URL) o tiene uno de los roles indicados.
//   router.put('/usuarios/:id', verificarToken, verificarDuenoORol('administrador'), controller.actualizar);
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
