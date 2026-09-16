const pool = require('../db');

async function getAllUsuarios() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
}

async function getUsuarioById(id) {
const [rows] = await pool.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
return rows[0] || null;
}

async function createUsuario(data) {
    const { nombre, correo, contrasena, rol } = data;
    const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, contrasena, rol]
    );
    return { id_usuario: result.insertId, ...data };
}

async function updateUsuario(id, data) {
    const { nombre, correo, rol } = data;
    await pool.query(
    'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id_usuario = ?',
    [nombre, correo, rol, id]
);
    return getUsuarioById(id);
}

async function deleteUsuario(id) {
    const [result] = await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
    return result.affectedRows > 0;
}


async function getAllCultivos() {
    const [rows] = await pool.query('SELECT * FROM cultivos');
    return rows;
}

async function getCultivoById(id) {
  const [rows] = await pool.query('SELECT * FROM cultivos WHERE id_cultivo = ?', [id]);
    return rows[0] || null;
}

async function createCultivo(data) {
    const { nombre, descripcion } = data;
    const [result] = await pool.query(
    'INSERT INTO cultivos (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion]
);
    return { id_cultivo: result.insertId, ...data };
}

async function updateCultivo(id, data) {
    const { nombre, descripcion } = data;
    await pool.query(
    'UPDATE cultivos SET nombre = ?, descripcion = ? WHERE id_cultivo = ?',
    [nombre, descripcion, id]
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
    `SELECT u.*, tu.rol AS rol_en_terreno
    FROM terrenos_usuarios tu
    JOIN usuarios u ON u.id_usuario = tu.id_usuario
    WHERE tu.id_terreno = ?`,
    [idTerreno]
);
    return rows;
}

async function asignarUsuarioATerreno(idTerreno, idUsuario, rol) {
await pool.query(
    'INSERT INTO terrenos_usuarios (id_terreno, id_usuario, rol) VALUES (?, ?, ?)',
    [idTerreno, idUsuario, rol]
);
    return { id_terreno: idTerreno, id_usuario: idUsuario, rol };
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