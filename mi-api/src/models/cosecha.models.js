const crud = require('../utils/crud');

const TABLA = 'historial_cosechas';
const ID = 'id_cosecha';

const esquema = {
  id_cultivo: { tipo: 'entero', min: 1, requerido: true },
  temporada: { tipo: 'cualquiera', requerido: true, maxLargo: 50 },
  fecha_siembra: { tipo: 'fecha' },
  fecha_cosecha: { tipo: 'fecha' },
  variedad_semilla: { tipo: 'cualquiera' },
  rendimiento_kg_ha: { tipo: 'numero', min: 0 },
  insumos_aplicados: { tipo: 'cualquiera', maxLargo: 5000 },
  incidencia_plagas: { tipo: 'cualquiera', maxLargo: 5000 },
};

const obtenerCosechasPorTerreno = (idTerreno, query) =>
  crud.listar(TABLA, { where: 'id_terreno = ?', params: [idTerreno], query, orden: ID });
const obtenerCosechaPorId = (id) => crud.obtener(TABLA, ID, id);
const crearCosecha = (idTerreno, datos) => crud.crear(TABLA, ID, { ...datos, id_terreno: idTerreno });
const actualizarCosecha = (id, datos) => crud.actualizar(TABLA, ID, id, datos);
const eliminarCosecha = (id) => crud.eliminar(TABLA, ID, id);

module.exports = {
  TABLA, ID, esquema, obtenerCosechasPorTerreno, obtenerCosechaPorId,
  crearCosecha, actualizarCosecha, eliminarCosecha,
};
