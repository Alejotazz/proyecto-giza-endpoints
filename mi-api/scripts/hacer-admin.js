// Convierte a un usuario existente en administrador.
//   npm run hacer-admin -- correo@ejemplo.com
//   node scripts/hacer-admin.js correo@ejemplo.com
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const pool = require('../config/db');

async function main() {
  const correo = (process.argv[2] || '').trim().toLowerCase();
  if (!correo) {
    console.error('Uso: node scripts/hacer-admin.js correo@ejemplo.com');
    return 1;
  }

  const [filas] = await pool.query('SELECT id_usuario, rol FROM usuarios WHERE correo = ?', [correo]);
  if (!filas[0]) {
    console.error(`No existe ningún usuario con el correo ${correo}`);
    return 1;
  }

  const { id_usuario: id, rol: rolAnterior } = filas[0];
  if (rolAnterior === 'administrador') {
    console.log(`${correo} ya era administrador. No se cambió nada.`);
    return 0;
  }

  await pool.query("UPDATE usuarios SET rol = 'administrador' WHERE id_usuario = ?", [id]);
  console.log(`Listo: ${correo} (id ${id}) pasó de "${rolAnterior}" a "administrador".`);
  return 0;
}

main()
  .then((codigo) => { process.exitCode = codigo; })
  .catch((error) => {
    console.error('No se pudo actualizar el usuario:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
