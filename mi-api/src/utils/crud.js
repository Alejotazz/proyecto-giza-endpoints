const pool = require('../../config/db');

// Funciones SQL comunes. Los nombres de tabla y columna vienen SIEMPRE del código
// (nunca del usuario): los valores van con "?" para evitar inyección SQL.

// Paginación opcional: ?limite=50&pagina=2. Sin ?limite devuelve todo (como antes).
function paginacion(query = {}) {
  if (query.limite === undefined) return { sql: '', params: [] };
  const limite = Math.min(Math.max(parseInt(query.limite, 10) || 100, 1), 500);
  const pagina = Math.max(parseInt(query.pagina, 10) || 1, 1);
  return { sql: ' LIMIT ? OFFSET ?', params: [limite, (pagina - 1) * limite] };
}

async function listar(tabla, { where = '', params = [], query, orden = '' } = {}) {
  const pag = paginacion(query);
  const [rows] = await pool.query(
    `SELECT * FROM ${tabla}${where ? ` WHERE ${where}` : ''}${orden ? ` ORDER BY ${orden}` : ''}${pag.sql}`,
    [...params, ...pag.params]
  );
  return rows;
}

async function obtener(tabla, columnaId, id) {
  const [rows] = await pool.query(`SELECT * FROM ${tabla} WHERE ${columnaId} = ?`, [id]);
  return rows[0] || null;
}

// Inserta solo las columnas presentes en "datos" y devuelve la fila guardada
async function crear(tabla, columnaId, datos) {
  const columnas = Object.keys(datos);
  const [resultado] = await pool.query(
    `INSERT INTO ${tabla} (${columnas.join(', ')}) VALUES (${columnas.map(() => '?').join(', ')})`,
    columnas.map((c) => datos[c])
  );
  return obtener(tabla, columnaId, resultado.insertId);
}

// Actualiza SOLO las columnas enviadas (los campos que no vienen conservan su valor).
// Devuelve la fila actualizada, o null si el id no existe.
async function actualizar(tabla, columnaId, id, datos, extraSet = '') {
  const columnas = Object.keys(datos);
  const sets = columnas.map((c) => `${c} = ?`);
  if (extraSet) sets.push(extraSet);
  const [resultado] = await pool.query(
    `UPDATE ${tabla} SET ${sets.join(', ')} WHERE ${columnaId} = ?`,
    [...columnas.map((c) => datos[c]), id]
  );
  if (resultado.affectedRows === 0) return null;
  return obtener(tabla, columnaId, id);
}

// Devuelve true si borró algo
async function eliminar(tabla, columnaId, id) {
  const [resultado] = await pool.query(`DELETE FROM ${tabla} WHERE ${columnaId} = ?`, [id]);
  return resultado.affectedRows > 0;
}

module.exports = { paginacion, listar, obtener, crear, actualizar, eliminar };
