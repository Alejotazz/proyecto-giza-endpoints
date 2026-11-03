// Tabla modelos_ia
module.exports = {
  tabla: 'modelos_ia',
  id: 'id_modelo',
  que: 'Modelo',
  esquema: {
    nombre_modelo: { tipo: 'texto', requerido: true, maxLargo: 150 },
    tipo: { tipo: 'cualquiera' },
    arquitectura: { tipo: 'cualquiera', maxLargo: 5000 },
    id_cultivo: { tipo: 'entero', min: 1 },
    version: { tipo: 'cualquiera', maxLargo: 50 },
  },
};
