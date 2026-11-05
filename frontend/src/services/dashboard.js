import api from '../api/axios';

const get = (url) => api.get(url).then((r) => r.data);

export const obtenerTerrenos = () => get('/terrenos');
export const obtenerCultivos = () => get('/cultivos');
export const obtenerCosechas = (idTerreno) => get(`/terrenos/${idTerreno}/cosechas`);
export const obtenerClima = (idTerreno) => get(`/terrenos/${idTerreno}/clima`);
export const obtenerSuelo = (idTerreno) => get(`/terrenos/${idTerreno}/muestras-suelo`);
export const obtenerImagenes = (idTerreno) => get(`/terrenos/${idTerreno}/imagenes`);

// Solo administrador
export const obtenerAlertas = () => get('/alertas');
export const obtenerModelos = () => get('/modelos');
export const obtenerEvaluaciones = () => get('/evaluaciones');

// Convierte el resultado de Promise.allSettled en { datos, error }
export const resultado = (r, mensaje = 'No se pudo cargar') =>
  r.status === 'fulfilled'
    ? { datos: Array.isArray(r.value) ? r.value : [], error: '' }
    : { datos: [], error: r.reason?.response?.data?.mensaje || mensaje };
