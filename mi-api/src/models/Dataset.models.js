// Tabla dataset_procesado. Las consultas genéricas están en utils/crud.js
module.exports = {
  tabla: 'dataset_procesado',
  id: 'id_registro',
  que: 'Registro',
  esquema: {
    id_terreno: { tipo: 'entero', min: 1, requerido: true },
    id_cultivo: { tipo: 'entero', min: 1 },
    temporada: { tipo: 'cualquiera', maxLargo: 50 },
    ndvi: { tipo: 'numero', min: -1, max: 1 },
    evi: { tipo: 'numero', min: -1, max: 1 },
    indice_fertilidad: { tipo: 'numero' },
    lluvia_acumulada: { tipo: 'numero', min: 0 },
    gdd_acumulado: { tipo: 'numero' },
    tendencia_rendimiento_5temp: { tipo: 'numero' },
    particion: { tipo: 'cualquiera', maxLargo: 20 },
  },
};
