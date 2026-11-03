const pool = require('../../config/db');
const crud = require('../utils/crud');

const TABLA = 'muestras_suelo';
const ID = 'id_muestra';
const pct = { tipo: 'numero', min: 0, max: 100 };

const esquema = {
  fecha_muestreo: { tipo: 'fecha', requerido: true },
  ph: { tipo: 'numero', min: 0, max: 14 },
  arcilla_pct: pct,
  arena_pct: pct,
  limo_pct: pct,
  materia_organica: { tipo: 'numero', min: 0 },
  nitrogeno: { tipo: 'numero', min: 0 },
  fosforo: { tipo: 'numero', min: 0 },
  potasio: { tipo: 'numero', min: 0 },
  humedad: { tipo: 'numero', min: 0 },
  capacidad_retencion_agua: { tipo: 'numero', min: 0 },
  microorganismos: { tipo: 'cualquiera', maxLargo: 5000 },
};

const obtenerMuestrasPorTerreno = (idTerreno, query) =>
  crud.listar(TABLA, { where: 'id_terreno = ?', params: [idTerreno], query, orden: 'fecha_muestreo' });

async function crearMuestraSuelo(idTerreno, datos) {
  const columnas = ['id_terreno', ...Object.keys(datos)];
  const [resultado] = await pool.query(
    `INSERT INTO ${TABLA} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`,
    [idTerreno, ...Object.values(datos)]
  );
  return { [ID]: resultado.insertId, id_terreno: idTerreno, ...datos };
}

module.exports = { esquema, obtenerMuestrasPorTerreno, crearMuestraSuelo };
