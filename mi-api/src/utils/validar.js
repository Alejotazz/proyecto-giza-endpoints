const { peticionInvalida } = require('./errores');

// Esquema: { campo: { tipo, requerido?, min?, max?, valores?, maxLargo? } }
// tipos: 'entero' | 'numero' | 'texto' | 'fecha' | 'hora' | 'booleano' | 'url' | 'cualquiera'
//
// validar(esquema, body)                -> para POST: exige los campos requeridos
// validar(esquema, body, { parcial })   -> para PUT: solo valida los campos enviados
// Devuelve un objeto SOLO con los campos del esquema (los demás se ignoran).
// Lanza un 400 con la lista de errores si algo no es válido.

const FECHA = /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const HORA = /^\d{2}:\d{2}(:\d{2})?$/;

function validarCampo(campo, regla, valor) {
  const { tipo } = regla;

  if (tipo === 'entero' || tipo === 'numero') {
    const n = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
    if (typeof n !== 'number' || !Number.isFinite(n)) return [`${campo} debe ser un número`];
    if (tipo === 'entero' && !Number.isInteger(n)) return [`${campo} debe ser un número entero`];
    if (regla.min !== undefined && n < regla.min) return [`${campo} debe ser >= ${regla.min}`];
    if (regla.max !== undefined && n > regla.max) return [`${campo} debe ser <= ${regla.max}`];
    return [null, n];
  }

  if (tipo === 'booleano') {
    if (valor === true || valor === 1 || valor === '1' || valor === 'true') return [null, true];
    if (valor === false || valor === 0 || valor === '0' || valor === 'false') return [null, false];
    return [`${campo} debe ser true o false`];
  }

  // Para columnas cuyo tipo exacto no está definido (texto o número): acepta ambos
  if (tipo === 'cualquiera') {
    if (typeof valor === 'number') return Number.isFinite(valor) ? [null, valor] : [`${campo} no es válido`];
    if (typeof valor === 'boolean') return [null, valor];
    if (typeof valor !== 'string') return [`${campo} debe ser texto o número`];
  } else if (typeof valor !== 'string') {
    return [`${campo} debe ser texto`];
  }
  const texto = valor.trim();

  if (tipo === 'fecha' && !(FECHA.test(texto) && !Number.isNaN(Date.parse(texto.slice(0, 10))))) {
    return [`${campo} debe ser una fecha AAAA-MM-DD`];
  }
  if (tipo === 'hora' && !HORA.test(texto)) return [`${campo} debe ser una hora HH:MM o HH:MM:SS`];
  if (tipo === 'url') {
    let url;
    try { url = new URL(texto); } catch { return [`${campo} debe ser una URL válida`]; }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return [`${campo} debe empezar por http:// o https://`];
  }
  if (regla.valores && !regla.valores.includes(texto)) {
    return [`${campo} debe ser uno de: ${regla.valores.join(', ')}`];
  }
  const maxLargo = regla.maxLargo ?? 255;
  if (texto.length > maxLargo) return [`${campo} no puede tener más de ${maxLargo} caracteres`];
  if (regla.requerido && texto === '') return [`${campo} es obligatorio`];
  return [null, texto];
}

function validar(esquema, body, { parcial = false } = {}) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw peticionInvalida('El cuerpo de la petición debe ser un objeto JSON');
  }

  const errores = [];
  const datos = {};

  for (const [campo, regla] of Object.entries(esquema)) {
    const valor = body[campo];
    const falta = valor === undefined || valor === '';

    if (falta) {
      if (regla.requerido && !parcial) errores.push(`${campo} es obligatorio`);
      continue;
    }
    if (valor === null) {
      if (regla.requerido) errores.push(`${campo} no puede ser null`);
      else datos[campo] = null;
      continue;
    }

    const [error, limpio] = validarCampo(campo, regla, valor);
    if (error) errores.push(error);
    else datos[campo] = limpio;
  }

  if (errores.length) throw peticionInvalida('Datos inválidos', errores);
  if (parcial && Object.keys(datos).length === 0) {
    throw peticionInvalida(`No se envió ningún campo para actualizar. Campos válidos: ${Object.keys(esquema).join(', ')}`);
  }
  return datos;
}

// Valida un :id de la URL (entero positivo)
function validarId(valor, nombre = 'id') {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw peticionInvalida(`${nombre} debe ser un entero positivo`);
  return n;
}

module.exports = { validar, validarId };
