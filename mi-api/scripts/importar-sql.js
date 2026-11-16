// Carga un archivo .sql en la base configurada en el .env (sirve para Aiven: usa SSL si DB_SSL=true).
//   node scripts/importar-sql.js ruta/al/archivo.sql
// Usa la misma conexión que la API, así que también funciona con MySQL 8 (caching_sha2_password).
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env'), quiet: true });
const mysql = require('mysql2/promise');
const { opcionesSSL } = require('../config/ssl');

async function main() {
  const archivo = process.argv[2];
  if (!archivo) {
    console.error('Uso: node scripts/importar-sql.js archivo.sql');
    return 1;
  }
  const sql = fs.readFileSync(archivo, 'utf8');

  const conexion = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: opcionesSSL(),
    multipleStatements: true,
    charset: 'utf8mb4',
  });
  try {
    await conexion.query(sql);
    const [tablas] = await conexion.query('SHOW TABLES');
    console.log(`Listo: se cargó ${path.basename(archivo)} en "${process.env.DB_NAME}" (${process.env.DB_HOST}). Tablas: ${tablas.length}`);
    return 0;
  } finally {
    await conexion.end();
  }
}

main()
  .then((codigo) => { process.exitCode = codigo; })
  .catch((error) => {
    console.error('No se pudo cargar el archivo:', error.message);
    process.exitCode = 1;
  });
