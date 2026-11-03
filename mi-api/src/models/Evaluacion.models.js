// Tabla evaluaciones (cada una pertenece a un entrenamiento: id_entrenamiento viene de la URL)
const metrica = { tipo: 'numero' };
const entre0y1 = { tipo: 'numero', min: 0, max: 1 };
module.exports = {
  tabla: 'evaluaciones',
  id: 'id_evaluacion',
  que: 'Evaluación',
  padre: { param: 'id_entrenamiento', columna: 'id_entrenamiento' },
  esquema: {
    mae: { tipo: 'numero', min: 0 },
    rmse: { tipo: 'numero', min: 0 },
    r2: metrica,
    precision_val: entre0y1,
    recall_val: entre0y1,
    f1_score: entre0y1,
    supera_umbral: { tipo: 'booleano' },
  },
};
