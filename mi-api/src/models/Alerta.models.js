// Tabla alertas (cada una pertenece a una predicción: id_prediccion viene de la URL)
module.exports = {
  tabla: 'alertas',
  id: 'id_alerta',
  que: 'Alerta',
  padre: { param: 'id_prediccion', columna: 'id_prediccion' },
  esquema: {
    tipo_alerta: { tipo: 'cualquiera', requerido: true, maxLargo: 50 },
    mensaje: { tipo: 'texto', requerido: true, maxLargo: 2000 },
  },
};
