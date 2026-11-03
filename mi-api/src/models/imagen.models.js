const crud = require('../utils/crud');

const TABLA = 'capturas_imagenes';
const ID = 'id_imagen';

const esquema = {
  tipo_imagen: { tipo: 'cualquiera', maxLargo: 50 },
  url_archivo: { tipo: 'url', requerido: true, maxLargo: 2048 },
  fecha_captura: { tipo: 'fecha' },
  hora_captura: { tipo: 'hora' },
  coordenadas_gps: { tipo: 'cualquiera' },
  zona_interes: { tipo: 'cualquiera' },
  nivel_rendimiento_esperado: { tipo: 'cualquiera' },
};

// Etiquetado manual
const esquemaEtiqueta = {
  etiqueta_estado: { tipo: 'texto', valores: ['saludable', 'estresado', 'enfermo'] },
  validado_doble_panel: { tipo: 'booleano' },
};

const obtenerImagenesPorTerreno = (idTerreno, query) =>
  crud.listar(TABLA, { where: 'id_terreno = ?', params: [idTerreno], query, orden: ID });
const crearImagen = (idTerreno, datos) => crud.crear(TABLA, ID, { ...datos, id_terreno: idTerreno });
const actualizarImagen = (id, datos) => crud.actualizar(TABLA, ID, id, datos, 'fecha_etiquetado = NOW()');

module.exports = { TABLA, ID, esquema, esquemaEtiqueta, obtenerImagenesPorTerreno, crearImagen, actualizarImagen };
