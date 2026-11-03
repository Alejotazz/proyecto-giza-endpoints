// Tabla retroalimentacion
const base = {
  diferencia_estimado_real: { tipo: 'numero' },
  incorporado_dataset: { tipo: 'booleano' },
};
module.exports = {
  tabla: 'retroalimentacion',
  id: 'id_feedback',
  que: 'Registro',
  esquema: {
    id_prediccion: { tipo: 'entero', min: 1, requerido: true },
    id_cosecha: { tipo: 'entero', min: 1 },
    ...base,
  },
  // Como antes, en el PUT solo se pueden cambiar estos dos campos
  esquemaUpdate: base,
};
