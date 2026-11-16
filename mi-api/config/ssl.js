const fs = require('fs');

// Opciones SSL para MySQL. En local (XAMPP) no hace falta: deja DB_SSL sin definir.
// En Aiven (u otro MySQL en la nube) se exige SSL:
//   DB_SSL=true
//   y el certificado CA de Aiven, de una de estas dos formas:
//     DB_SSL_CA_PATH=/etc/secrets/ca.pem   (archivo; en Render: "Secret Files")
//     DB_SSL_CA=-----BEGIN CERTIFICATE-----\n...   (el texto del certificado en la variable)
function opcionesSSL() {
  if (String(process.env.DB_SSL).toLowerCase() !== 'true') return undefined;

  let ca = process.env.DB_SSL_CA;
  if (!ca && process.env.DB_SSL_CA_PATH) ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
  if (ca) ca = ca.replace(/\\n/g, '\n'); // por si el certificado se pegó en una sola línea con \n

  if (!ca) {
    console.error('❌ DB_SSL=true pero falta el certificado: define DB_SSL_CA (texto del certificado) o DB_SSL_CA_PATH (ruta del archivo). Aiven no aceptará la conexión.');
  }
  // Siempre se verifica el certificado del servidor
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true };
}

module.exports = { opcionesSSL };
