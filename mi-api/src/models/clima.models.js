const pool = require('../../config/db');
const crud = require('../utils/crud');

const TABLA = 'datos_meteorologicos';
const ID = 'id_clima';

const esquema = {
  fecha: { tipo: 'fecha', requerido: true },
  temp_max: { tipo: 'numero', min: -90, max: 70 },
  temp_min: { tipo: 'numero', min: -90, max: 70 },
  temp_promedio: { tipo: 'numero', min: -90, max: 70 },
  precipitacion_mm: { tipo: 'numero', min: 0 },
  humedad_relativa: { tipo: 'numero', min: 0, max: 100 },
  radiacion_solar: { tipo: 'numero', min: 0 },
  velocidad_viento: { tipo: 'numero', min: 0 },
  indice_uv: { tipo: 'numero', min: 0, max: 20 },
  gdd: { tipo: 'numero' },
};

const obtenerClimaPorTerreno = (idTerreno, query) =>
  crud.listar(TABLA, { where: 'id_terreno = ?', params: [idTerreno], query, orden: 'fecha' });

// Devuelve lo enviado + ids (no se relee la fila porque no conocemos con certeza
// el nombre de la clave primaria de datos_meteorologicos)
async function crearDatoClima(idTerreno, datos) {
  const columnas = ['id_terreno', ...Object.keys(datos)];
  const valores = [idTerreno, ...Object.values(datos)];
  const [resultado] = await pool.query(
    `INSERT INTO ${TABLA} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`,
    valores
  );
  return { [ID]: resultado.insertId, id_terreno: idTerreno, ...datos };
}

module.exports = { esquema, obtenerClimaPorTerreno, crearDatoClima };
