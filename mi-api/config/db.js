require('dotenv').config();
const mysql = require('mysql2/promise');

// createPool: reutiliza conexiones automáticamente
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: Number(process.env.DB_POOL_LIMIT) || 10,
  waitForConnections: true,
});

// Verificar conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL conectado a la base:', process.env.DB_NAME);
    conn.release(); // devolver al pool
  })
  .catch(err => {
    console.error('❌ Error MySQL:', err.message);
    process.exit(1); // detener app si no hay DB
  });

module.exports = pool;