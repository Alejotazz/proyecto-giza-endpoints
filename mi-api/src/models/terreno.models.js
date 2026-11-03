const pool = require('../../config/db');
const crud = require('../utils/crud');
const { paginacion } = require('../utils/crud');

const TABLA = 'terrenos';
const ID = 'id_terreno';

const esquema = {
  nombre: { tipo: 'texto', requerido: true, maxLargo: 150 },
  id_cultivo: { tipo: 'entero', min: 1, requerido: true },
  area_hectareas: { tipo: 'numero', min: 0 },
  altitud_msnm: { tipo: 'numero', min: -500, max: 9000 },
  topografia: { tipo: 'cualquiera' },
  pendiente: { tipo: 'cualquiera' },
  sistema_riego: { tipo: 'cualquiera' },
  historial_uso_terreno: { tipo: 'texto', maxLargo: 5000 },
  coordenadas_lat: { tipo: 'numero', min: -90, max: 90 },
  coordenadas_lon: { tipo: 'numero', min: -180, max: 180 },
};

// Admin: todos los terrenos
const obtenerTerrenos = (query) => crud.listar(TABLA, { query, orden: ID });

// Usuario normal: solo los terrenos a los que está asignado
async function obtenerTerrenosDeUsuario(idUsuario, query) {
  const pag = paginacion(query);
  const [rows] = await pool.query(
    `SELECT t.* FROM terrenos t
     JOIN terrenos_usuarios tu ON tu.id_terreno = t.id_terreno
     WHERE tu.id_usuario = ?
     ORDER BY t.id_terreno${pag.sql}`,
    [idUsuario, ...pag.params]
  );
  return rows;
}

const obtenerTerrenoPorId = (id) => crud.obtener(TABLA, ID, id);
const crearTerreno = (datos) => crud.crear(TABLA, ID, datos);
const actualizarTerreno = (id, datos) => crud.actualizar(TABLA, ID, id, datos);
const eliminarTerreno = (id) => crud.eliminar(TABLA, ID, id);

module.exports = {
  esquema, obtenerTerrenos, obtenerTerrenosDeUsuario, obtenerTerrenoPorId,
  crearTerreno, actualizarTerreno, eliminarTerreno,
};
