// Tabla entrenamientos (cada uno pertenece a un modelo: id_modelo viene de la URL)
module.exports = {
  tabla: 'entrenamientos',
  id: 'id_entrenamiento',
  que: 'Entrenamiento',
  padre: { param: 'id_modelo', columna: 'id_modelo' },
  esquema: {
    fecha_inicio: { tipo: 'fecha' },
    fecha_fin: { tipo: 'fecha' },
    funcion_perdida: { tipo: 'cualquiera' },
    metrica_evaluacion: { tipo: 'cualquiera' },
    learning_rate: { tipo: 'numero', min: 0 },
    capas: { tipo: 'entero', min: 0 },
    neuronas: { tipo: 'cualquiera' },
    regularizacion: { tipo: 'cualquiera' },
    data_augmentation: { tipo: 'booleano' },
    estado: { tipo: 'cualquiera', maxLargo: 50 },
  },
};
