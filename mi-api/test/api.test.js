// Pruebas de integración: levantan la API y hacen peticiones reales contra la base
// configurada en .env. ¡Usar una base de PRUEBA, no la real! (crean y borran datos)
//   npm test
// Si no hay conexión a MySQL, las pruebas se saltan.
require('dotenv').config();
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secreto-de-prueba';
process.env.AUTH_RATE_LIMIT = process.env.AUTH_RATE_LIMIT || '1000';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const pool = require('../config/db');
const app = require('../src/app');

let servidor;
let base;
let hayBD = true;
const sufijo = Date.now();
const creados = { usuarios: [], terrenos: [], cultivos: [] };

async function pedir(metodo, ruta, { token, body, headers = {} } = {}) {
  const res = await fetch(base + ruta, {
    method: metodo,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const texto = await res.text();
  let json;
  try { json = texto ? JSON.parse(texto) : undefined; } catch { json = texto; }
  return { status: res.status, body: json, headers: res.headers };
}

async function registrar(nombre, extra = {}) {
  const correo = `${nombre}.${sufijo}@prueba.com`;
  const r = await pedir('POST', '/api/auth/registro', { body: { nombre, correo, password: 'secreto123', ...extra } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  creados.usuarios.push(r.body.usuario.id_usuario);
  return { ...r.body, correo };
}

let admin; let ana; let beto; let idCultivo; let idTerreno;

before(async () => {
  try { await pool.query('SELECT 1'); } catch { hayBD = false; return; }
  servidor = app.listen(0);
  base = `http://127.0.0.1:${servidor.address().port}`;

  admin = await registrar('admin');
  await pool.query("UPDATE usuarios SET rol = 'administrador' WHERE id_usuario = ?", [admin.usuario.id_usuario]);
  ana = await registrar('ana');
  beto = await registrar('beto');

  const c = await pedir('POST', '/api/cultivos', { token: admin.token, body: { nombre_cultivo: `Café ${sufijo}` } });
  idCultivo = c.body.id_cultivo; creados.cultivos.push(idCultivo);
  const t = await pedir('POST', '/api/terrenos', {
    token: admin.token,
    body: { nombre: 'Lote A', id_cultivo: idCultivo, area_hectareas: 3.5, coordenadas_lat: 4.6, coordenadas_lon: -74 },
  });
  idTerreno = t.body.id_terreno; creados.terrenos.push(idTerreno);
  const asignacion = await pedir('POST', `/api/terrenos/${idTerreno}/usuarios`, { token: admin.token, body: { id_usuario: ana.usuario.id_usuario } });
  assert.equal(asignacion.status, 201, JSON.stringify(asignacion.body));
});

after(async () => {
  if (hayBD) {
    for (const id of creados.terrenos) {
      for (const t of ['historial_cosechas', 'datos_meteorologicos', 'muestras_suelo', 'capturas_imagenes', 'dataset_procesado']) {
        await pool.query(`DELETE FROM ${t} WHERE id_terreno = ?`, [id]).catch(() => {});
      }
      await pool.query('DELETE FROM terrenos_usuarios WHERE id_terreno = ?', [id]).catch(() => {});
      await pool.query('DELETE FROM terrenos WHERE id_terreno = ?', [id]).catch(() => {});
    }
    for (const id of creados.cultivos) await pool.query('DELETE FROM cultivos WHERE id_cultivo = ?', [id]).catch(() => {});
    for (const id of creados.usuarios) await pool.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]).catch(() => {});
  }
  if (servidor) servidor.close();
  await pool.end();
});

const t2 = (nombre, fn) => test(nombre, async (t) => { if (!hayBD) return t.skip('sin conexión a MySQL'); await fn(); });

t2('CORS permite Content-Type y Authorization', async () => {
  const r = await pedir('OPTIONS', '/api/auth/login', {
    headers: { Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type,authorization' },
  });
  assert.match(r.headers.get('access-control-allow-headers'), /Content-Type/);
  assert.match(r.headers.get('access-control-allow-headers'), /Authorization/);
});

t2('registro valida correo y password', async () => {
  assert.equal((await pedir('POST', '/api/auth/registro', { body: { nombre: 'x', correo: 'no-es-correo', password: 'secreto123' } })).status, 400);
  assert.equal((await pedir('POST', '/api/auth/registro', { body: { nombre: 'x', correo: `x${sufijo}@a.com`, password: 1234567 } })).status, 400);
  assert.equal((await pedir('POST', '/api/auth/registro', { body: { nombre: 'x', correo: ana.correo, password: 'secreto123' } })).status, 409);
});

t2('login correcto e incorrecto; usuario sin password da 401', async () => {
  assert.equal((await pedir('POST', '/api/auth/login', { body: { correo: ana.correo, password: 'secreto123' } })).status, 200);
  assert.equal((await pedir('POST', '/api/auth/login', { body: { correo: ana.correo, password: 'mala' } })).status, 401);
  const [r] = await pool.query("INSERT INTO usuarios (nombre, correo, password) VALUES ('viejo', ?, '')", [`viejo.${sufijo}@prueba.com`]);
  creados.usuarios.push(r.insertId);
  assert.equal((await pedir('POST', '/api/auth/login', { body: { correo: `viejo.${sufijo}@prueba.com`, password: 'loquesea' } })).status, 401);
});

t2('un usuario sin asignar NO ve ni modifica el terreno', async () => {
  assert.equal((await pedir('GET', `/api/terrenos/${idTerreno}`, { token: beto.token })).status, 403);
  assert.equal((await pedir('PUT', `/api/terrenos/${idTerreno}`, { token: beto.token, body: { nombre: 'hack' } })).status, 403);
  assert.equal((await pedir('DELETE', `/api/terrenos/${idTerreno}`, { token: beto.token })).status, 403);
  assert.equal((await pedir('GET', `/api/terrenos/${idTerreno}/usuarios`, { token: beto.token })).status, 403);
  assert.equal((await pedir('GET', `/api/terrenos/${idTerreno}/cosechas`, { token: beto.token })).status, 403);
  const lista = await pedir('GET', '/api/terrenos', { token: beto.token });
  assert.equal(lista.status, 200);
  assert.equal(lista.body.some((t) => t.id_terreno === idTerreno), false);
});

t2('el usuario asignado sí accede, y el PUT parcial no borra otros campos', async () => {
  const lista = await pedir('GET', '/api/terrenos', { token: ana.token });
  assert.equal(lista.body.some((t) => t.id_terreno === idTerreno), true);
  const r = await pedir('PUT', `/api/terrenos/${idTerreno}`, { token: ana.token, body: { nombre: 'Lote B' } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.nombre, 'Lote B');
  assert.equal(Number(r.body.area_hectareas), 3.5);
  assert.equal(r.body.id_cultivo, idCultivo);
});

t2('cosechas: validación, acceso por id y 404', async () => {
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/cosechas`, { token: ana.token, body: { temporada: '2025A' } })).status, 400);
  const c = await pedir('POST', `/api/terrenos/${idTerreno}/cosechas`, {
    token: ana.token, body: { id_cultivo: idCultivo, temporada: '2025A', fecha_siembra: '2025-01-10', fecha_cosecha: '2025-06-01', rendimiento_kg_ha: 1200 },
  });
  assert.equal(c.status, 201, JSON.stringify(c.body));
  assert.equal(c.body.id_terreno, idTerreno);
  assert.equal((await pedir('GET', `/api/cosechas/${c.body.id_cosecha}`, { token: beto.token })).status, 403);
  assert.equal((await pedir('PUT', `/api/cosechas/${c.body.id_cosecha}`, { token: ana.token, body: { fecha_cosecha: '2024-01-01' } })).status, 400);
  assert.equal((await pedir('GET', '/api/cosechas/999999', { token: admin.token })).status, 404);
  assert.equal((await pedir('GET', '/api/cosechas/abc', { token: admin.token })).status, 400);
});

t2('clima, muestras e imágenes validan datos', async () => {
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/clima`, { token: ana.token, body: { fecha: '2025-02-01', temp_max: 25, temp_min: 12 } })).status, 201);
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/clima`, { token: ana.token, body: { fecha: 'ayer' } })).status, 400);
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/muestras-suelo`, { token: ana.token, body: { fecha_muestreo: '2025-02-01', ph: 6.5 } })).status, 201);
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/muestras-suelo`, { token: ana.token, body: { fecha_muestreo: '2025-02-01', ph: 20 } })).status, 400);
  assert.equal((await pedir('POST', `/api/terrenos/${idTerreno}/imagenes`, { token: ana.token, body: { url_archivo: 'javascript:alert(1)' } })).status, 400);
  const img = await pedir('POST', `/api/terrenos/${idTerreno}/imagenes`, { token: ana.token, body: { url_archivo: 'https://ejemplo.com/a.jpg' } });
  assert.equal(img.status, 201, JSON.stringify(img.body));
  assert.equal((await pedir('PUT', `/api/imagenes/${img.body.id_imagen}`, { token: ana.token, body: { etiqueta_estado: 'raro' } })).status, 400);
  const et = await pedir('PUT', `/api/imagenes/${img.body.id_imagen}`, { token: ana.token, body: { etiqueta_estado: 'saludable' } });
  assert.equal(et.status, 200);
  assert.equal(et.body.etiqueta_estado, 'saludable');
});

t2('modelos/dataset/alertas: solo el admin modifica', async () => {
  assert.equal((await pedir('POST', '/api/modelos', { token: ana.token, body: { nombre_modelo: 'x' } })).status, 403);
  const m = await pedir('POST', '/api/modelos', { token: admin.token, body: { nombre_modelo: `CNN ${sufijo}`, tipo: 'imagenes_CNN', id_cultivo: idCultivo, version: 1 } });
  assert.equal(m.status, 201, JSON.stringify(m.body));
  assert.equal((await pedir('GET', `/api/modelos/${m.body.id_modelo}`, { token: ana.token })).status, 200);
  assert.equal((await pedir('PUT', `/api/modelos/${m.body.id_modelo}`, { token: admin.token, body: { version: '2' } })).body.nombre_modelo, `CNN ${sufijo}`);
  assert.equal((await pedir('PUT', '/api/modelos/999999', { token: admin.token, body: { version: '2' } })).status, 404);
  assert.equal((await pedir('DELETE', '/api/modelos/999999', { token: admin.token })).status, 404);
  assert.equal((await pedir('DELETE', `/api/modelos/${m.body.id_modelo}`, { token: admin.token })).status, 204);
  assert.equal((await pedir('GET', '/api/dataset', { token: ana.token })).status, 403);
  assert.equal((await pedir('GET', `/api/terrenos/${idTerreno}/dataset`, { token: ana.token })).status, 200);
  assert.equal((await pedir('GET', '/api/alertas', { token: ana.token })).status, 403);
  assert.equal((await pedir('GET', '/api/retroalimentacion', { token: ana.token })).status, 403);
});

t2('registro: tipo_usuario define el rol y nunca da administrador ni investigador', async () => {
  const sinTipo = await registrar('sintipo');
  assert.equal(sinTipo.usuario.rol, 'agricultor');
  const agro = await registrar('agronoma', { tipo_usuario: 'agronomo' });
  assert.equal(agro.usuario.rol, 'agronomo');
  const emp = await registrar('empresa', { tipo_usuario: 'empresa' });
  assert.equal(emp.usuario.rol, 'empresa');
  for (const tipo_usuario of ['administrador', 'investigador', 'inventado']) {
    const r = await pedir('POST', '/api/auth/registro', { body: { nombre: 'x', correo: `tipo.${tipo_usuario}.${sufijo}@prueba.com`, password: 'secreto123', tipo_usuario } });
    assert.equal(r.status, 400, JSON.stringify(r.body));
  }
  // El body no puede colar un rol por otro campo
  const colado = await registrar('colado', { rol: 'administrador' });
  assert.equal(colado.usuario.rol, 'agricultor');
});

t2('dataset: el investigador (asignado por un admin) lee todo, el agricultor no y el investigador no escribe', async () => {
  const inv = await registrar('lectora');
  assert.equal((await pedir('GET', '/api/dataset', { token: inv.token })).status, 403);
  const ascenso = await pedir('PUT', `/api/usuarios/${inv.usuario.id_usuario}`, { token: admin.token, body: { rol: 'investigador' } });
  assert.equal(ascenso.status, 200, JSON.stringify(ascenso.body));
  assert.equal(ascenso.body.rol, 'investigador');
  assert.equal((await pedir('GET', '/api/dataset', { token: inv.token })).status, 200);
  assert.equal((await pedir('GET', '/api/dataset', { token: ana.token })).status, 403);
  assert.equal((await pedir('GET', '/api/dataset', { token: admin.token })).status, 200);
  assert.equal((await pedir('POST', '/api/dataset', { token: inv.token, body: {} })).status, 403);
});

t2('terrenos_usuarios: rol_relacion se valida, por defecto consultor, y no se duplica', async () => {
  const ruta = `/api/terrenos/${idTerreno}/usuarios`;
  const quien = await pedir('GET', ruta, { token: admin.token });
  assert.equal(quien.status, 200, JSON.stringify(quien.body));
  assert.equal(quien.body.find((u) => u.id_usuario === ana.usuario.id_usuario).rol_relacion, 'consultor');

  const carla = await registrar('carla');
  assert.equal((await pedir('POST', ruta, { token: admin.token, body: { id_usuario: carla.usuario.id_usuario, rol_relacion: 'jefe' } })).status, 400);
  const ok = await pedir('POST', ruta, { token: admin.token, body: { id_usuario: carla.usuario.id_usuario, rol_relacion: 'encargado' } });
  assert.equal(ok.status, 201, JSON.stringify(ok.body));
  assert.equal(ok.body.rol_relacion, 'encargado');
  assert.equal((await pedir('POST', ruta, { token: admin.token, body: { id_usuario: carla.usuario.id_usuario } })).status, 409);
  assert.equal((await pedir('POST', ruta, { token: ana.token, body: { id_usuario: carla.usuario.id_usuario } })).status, 403);
  assert.equal((await pedir('DELETE', `${ruta}/${carla.usuario.id_usuario}`, { token: admin.token })).status, 200);
});

t2('el admin puede asignar los roles nuevos', async () => {
  const dora = await registrar('dora');
  const r = await pedir('PUT', `/api/usuarios/${dora.usuario.id_usuario}`, { token: admin.token, body: { rol: 'empresa' } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.rol, 'empresa');
});

t2('errores de BD no exponen SQL y se traducen a 4xx', async () => {
  const r = await pedir('POST', '/api/terrenos', { token: admin.token, body: { nombre: 'x', id_cultivo: 999999 } });
  assert.equal(r.status, 400);
  assert.doesNotMatch(JSON.stringify(r.body), /SQL|FOREIGN|constraint/i);
});

t2('usuarios: correo duplicado da 409, no se cambia el propio rol, token de usuario borrado deja de servir', async () => {
  assert.equal((await pedir('PUT', `/api/usuarios/${ana.usuario.id_usuario}`, { token: ana.token, body: { correo: beto.correo } })).status, 409);
  assert.equal((await pedir('PUT', `/api/usuarios/${ana.usuario.id_usuario}`, { token: ana.token, body: { rol: 'administrador' } })).status, 403);
  assert.equal((await pedir('PUT', `/api/usuarios/${admin.usuario.id_usuario}`, { token: admin.token, body: { rol: 'inventado' } })).status, 400);
  assert.equal((await pedir('DELETE', `/api/usuarios/${admin.usuario.id_usuario}`, { token: admin.token })).status, 400);
  const parcial = await pedir('PUT', `/api/usuarios/${ana.usuario.id_usuario}`, { token: ana.token, body: { nombre: 'Ana María' } });
  assert.equal(parcial.status, 200);
  assert.equal(parcial.body.correo, ana.correo);
  assert.equal((await pedir('DELETE', `/api/usuarios/${beto.usuario.id_usuario}`, { token: admin.token })).status, 200);
  assert.equal((await pedir('GET', '/api/auth/perfil', { token: beto.token })).status, 401);
});

t2('rol degradado pierde permisos de inmediato', async () => {
  await pool.query("UPDATE usuarios SET rol = 'agricultor' WHERE id_usuario = ?", [admin.usuario.id_usuario]);
  assert.equal((await pedir('GET', '/api/usuarios', { token: admin.token })).status, 403);
  await pool.query("UPDATE usuarios SET rol = 'administrador' WHERE id_usuario = ?", [admin.usuario.id_usuario]);
});

t2('salud y JSON inválido', async () => {
  assert.equal((await pedir('GET', '/api/salud')).status, 200);
  const r = await fetch(base + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{mal' });
  assert.equal(r.status, 400);
});
