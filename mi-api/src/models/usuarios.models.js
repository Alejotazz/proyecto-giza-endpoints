const pool = require('../../config/db');
const { paginacion } = require('../utils/crud');

// Columnas públicas: nunca se devuelve el password
const COLUMNAS = 'id_usuario, nombre, correo, telefono, rol, fecha_registro';

async function getAllUsuarios(query) {
    const pag = paginacion(query);
    const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id_usuario${pag.sql}`, pag.params);
    return rows;
}

async function getUsuarioByCorreo(correo) {
    const [rows] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
    return rows[0] || null;
}

async function getUsuarioById(id) {
const [rows] = await pool.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id_usuario = ?`, [id]);
return rows[0] || null;
}

async function createUsuario(data) {
    // data.password debe llegar YA hasheado desde el controller
    const { nombre, correo, password, telefono, rol } = data;
    const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, correo, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
    [nombre, correo, password, telefono || null, rol || 'agricultor']
    );
    return getUsuarioById(result.insertId);
}

async function updateUsuario(id, data) {
    const { nombre, correo, telefono, rol } = data;
    await pool.query(
    'UPDATE usuarios SET nombre = ?, correo = ?, telefono = ?, rol = ? WHERE id_usuario = ?',
    [nombre, correo, telefono ?? null, rol, id]
);
    return getUsuarioById(id);
}

async function deleteUsuario(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    return result.affectedRows > 0;
}


async function getAllCultivos(query) {
    const pag = paginacion(query);
    const [rows] = await pool.query(`SELECT * FROM cultivos ORDER BY id_cultivo${pag.sql}`, pag.params);
    return rows;
}

async function getCultivoById(id) {
  const [rows] = await pool.query('SELECT * FROM cultivos WHERE id_cultivo = ?', [id]);
    return rows[0] || null;
}

async function createCultivo(data) {
    const { nombre_cultivo } = data;
    const [result] = await pool.query(
    'INSERT INTO cultivos (nombre_cultivo) VALUES (?)',
    [nombre_cultivo]
);
    return getCultivoById(result.insertId);
}

async function updateCultivo(id, data) {
    const { nombre_cultivo } = data;
    await pool.query(
    'UPDATE cultivos SET nombre_cultivo = ? WHERE id_cultivo = ?',
    [nombre_cultivo, id]
);
    return getCultivoById(id);
}

async function deleteCultivo(id) {
    const [result] = await pool.query('DELETE FROM cultivos WHERE id_cultivo = ?', [id]);
    return result.affectedRows > 0;
}

// ---------- TERRENOS_USUARIOS (relación) ----------

async function getUsuariosByTerreno(idTerreno) {
    const [rows] = await pool.query(
    `SELECT u.id_usuario, u.nombre, u.correo, u.rol, tu.rol_relacion
    FROM terrenos_usuarios tu
    JOIN usuarios u ON u.id_usuario = tu.id_usuario
    WHERE tu.id_terreno = ?`,
    [idTerreno]
);
    return rows;
}

async function asignarUsuarioATerreno(idTerreno, idUsuario, rolRelacion) {
await pool.query(
    'INSERT INTO terrenos_usuarios (id_terreno, id_usuario, rol_relacion) VALUES (?, ?, ?)',
    [idTerreno, idUsuario, rolRelacion]
);
    return { id_terreno: idTerreno, id_usuario: idUsuario, rol_relacion: rolRelacion };
}

async function quitarUsuarioDeTerreno(idTerreno, idUsuario) {
    const [result] = await pool.query(
    'DELETE FROM terrenos_usuarios WHERE id_terreno = ? AND id_usuario = ?',
    [idTerreno, idUsuario]
);
    return result.affectedRows > 0;
}

module.exports = {
getAllUsuarios,
getUsuarioById,
getUsuarioByCorreo,
createUsuario,
updateUsuario,
deleteUsuario,
getAllCultivos,
getCultivoById,
createCultivo,
updateCultivo,
deleteCultivo,
getUsuariosByTerreno,
asignarUsuarioATerreno,
quitarUsuarioDeTerreno,
};