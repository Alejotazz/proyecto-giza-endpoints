import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as srv from '../services/dashboard';
import { GraficoBarras, GraficoLineas, Leyenda, EscalaPH, fmt } from '../components/charts';
import { ROL_ADMIN, ROL_INVESTIGADOR, etiquetaRol, iconoRol } from '../utils/roles';
import '../styles/dashboard.css';

const hoy = () => {
  const t = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  return t.charAt(0).toUpperCase() + t.slice(1);
};
// '2026-10-20' se interpreta como fecha local (sin esto, en Colombia sale un día antes)
const aFecha = (v) => new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? `${v}T00:00:00` : v);
const fechaCorta = (v) => {
  const d = aFecha(v);
  return Number.isNaN(d.getTime()) ? String(v ?? '') : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};
const num = (v) => (v == null || v === '' ? null : Number(v));
const promedio = (vals) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null);

const ESTADOS = [
  { id: 'saludable', nombre: 'Saludable', icono: '🌿', clase: 'st-good' },
  { id: 'estresado', nombre: 'Estresado', icono: '⚠️', clase: 'st-warn' },
  { id: 'enfermo', nombre: 'Enfermo', icono: '🦠', clase: 'st-bad' },
  { id: 'sin_etiquetar', nombre: 'Sin etiquetar', icono: '❔', clase: 'st-none' },
];

function Kpi({ icono, etiqueta, valor, unidad, cargando, error }) {
  return (
    <div className="kpi">
      <span className="kpi__ico">{icono}</span>
      <div>
        <small>{etiqueta}</small>
        {cargando ? <span className="skel skel--num" /> : (
          <b title={error || undefined}>{valor ?? '—'}{valor != null && unidad && <em> {unidad}</em>}</b>
        )}
      </div>
    </div>
  );
}

function Widget({ titulo, sub, cargando, error, vacio, children, className = '' }) {
  return (
    <section className={`app-card widget ${className}`}>
      <h3>{titulo}</h3>
      {sub && <p className="muted">{sub}</p>}
      {cargando ? <div className="skel skel--chart" />
        : error ? <div className="g-alert g-alert--error">{error}</div>
        : vacio ? <div className="widget__empty">{vacio}</div>
        : children}
    </section>
  );
}

// ---------- Panel del terreno seleccionado ----------
function PanelTerreno({ terreno, cosechas }) {
  const [d, setD] = useState({ cargando: true });

  useEffect(() => {
    let vivo = true;
    setD({ cargando: true });
    Promise.allSettled([srv.obtenerClima(terreno.id_terreno), srv.obtenerSuelo(terreno.id_terreno), srv.obtenerImagenes(terreno.id_terreno)])
      .then(([c, s, i]) => vivo && setD({
        cargando: false,
        clima: srv.resultado(c, 'No se pudo cargar el clima'),
        suelo: srv.resultado(s, 'No se pudieron cargar las muestras de suelo'),
        imagenes: srv.resultado(i, 'No se pudieron cargar las imágenes'),
      }));
    return () => { vivo = false; };
  }, [terreno.id_terreno]);

  const rendimiento = useMemo(() => {
    const grupos = {};
    (cosechas.datos || []).forEach((c) => {
      const v = num(c.rendimiento_kg_ha);
      if (v == null) return;
      (grupos[c.temporada] ||= []).push(v);
    });
    return Object.entries(grupos).map(([etiqueta, vals]) => ({ etiqueta, valor: promedio(vals) }));
  }, [cosechas]);

  const clima = useMemo(() => {
    const filas = [...(d.clima?.datos || [])].sort((a, b) => aFecha(a.fecha) - aFecha(b.fecha)).slice(-30);
    return {
      etiquetas: filas.map((f) => fechaCorta(f.fecha)),
      max: filas.map((f) => num(f.temp_max)),
      min: filas.map((f) => num(f.temp_min)),
      lluvia: filas.map((f) => ({ etiqueta: fechaCorta(f.fecha), valor: num(f.precipitacion_mm) ?? 0 })),
      hayTemp: filas.some((f) => num(f.temp_max) != null || num(f.temp_min) != null),
      hayLluvia: filas.some((f) => num(f.precipitacion_mm) != null),
    };
  }, [d.clima]);

  const suelo = useMemo(() => {
    const filas = [...(d.suelo?.datos || [])].sort((a, b) => aFecha(b.fecha_muestreo) - aFecha(a.fecha_muestreo));
    return filas[0];
  }, [d.suelo]);

  const estados = useMemo(() => {
    const cuenta = Object.fromEntries(ESTADOS.map((e) => [e.id, 0]));
    (d.imagenes?.datos || []).forEach((img) => { cuenta[img.etiqueta_estado || 'sin_etiquetar'] = (cuenta[img.etiqueta_estado || 'sin_etiquetar'] || 0) + 1; });
    return cuenta;
  }, [d.imagenes]);
  const totalImg = Object.values(estados).reduce((a, b) => a + b, 0);

  return (
    <div className="dash-grid">
      <Widget titulo="Rendimiento por temporada" sub="Promedio de rendimiento de las cosechas, en kg/ha"
        error={cosechas.error} vacio={rendimiento.length === 0 && 'Este terreno aún no tiene cosechas con rendimiento registrado.'}>
        <GraficoBarras datos={rendimiento} unidad="kg/ha" titulo="Rendimiento" color="var(--ch-1)" />
      </Widget>

      <Widget titulo="Clima" sub="Últimos 30 registros meteorológicos" cargando={d.cargando} error={d.clima?.error}
        vacio={!clima.hayTemp && !clima.hayLluvia && 'Este terreno aún no tiene datos meteorológicos.'}>
        {clima.hayTemp && (
          <>
            <div className="widget__subhead"><span>Temperatura</span>
              <Leyenda items={[{ nombre: 'Máxima', color: 'var(--ch-max)' }, { nombre: 'Mínima', color: 'var(--ch-min)' }]} />
            </div>
            <GraficoLineas etiquetas={clima.etiquetas} unidad="°C" titulo="Temperatura"
              series={[{ nombre: 'Máxima', color: 'var(--ch-max)', valores: clima.max }, { nombre: 'Mínima', color: 'var(--ch-min)', valores: clima.min }]} />
          </>
        )}
        {clima.hayLluvia && (
          <>
            <div className="widget__subhead"><span>Precipitación</span></div>
            <GraficoBarras datos={clima.lluvia} unidad="mm" titulo="Precipitación" color="var(--ch-2)" />
          </>
        )}
      </Widget>

      <Widget titulo="Suelo" sub={suelo ? `Última muestra: ${aFecha(suelo.fecha_muestreo).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}` : 'Última muestra de suelo'}
        cargando={d.cargando} error={d.suelo?.error} vacio={!suelo && 'Este terreno aún no tiene muestras de suelo.'}>
        {suelo && (
          <>
            {num(suelo.ph) != null ? <EscalaPH valor={num(suelo.ph)} /> : <p className="muted">Sin dato de pH.</p>}
            <div className="nutri">
              {[['Nitrógeno (N)', suelo.nitrogeno], ['Fósforo (P)', suelo.fosforo], ['Potasio (K)', suelo.potasio], ['Materia orgánica', suelo.materia_organica]].map(([k, v]) => (
                <div key={k}><small>{k}</small><b>{fmt(num(v), 2)}</b></div>
              ))}
            </div>
          </>
        )}
      </Widget>

      <Widget titulo="Estado del cultivo" sub="Imágenes del terreno según su etiqueta" cargando={d.cargando} error={d.imagenes?.error}
        vacio={totalImg === 0 && 'Este terreno aún no tiene imágenes.'}>
        <div className="estados">
          {ESTADOS.map((e) => (
            <div key={e.id} className={`estado ${e.clase}`}>
              <div className="estado__top"><span>{e.icono} {e.nombre}</span><b>{estados[e.id]}</b></div>
              <div className="estado__bar"><span style={{ width: `${totalImg ? (estados[e.id] / totalImg) * 100 : 0}%` }} /></div>
            </div>
          ))}
        </div>
        <p className="muted" style={{ margin: '12px 0 0' }}>{totalImg} {totalImg === 1 ? 'imagen' : 'imágenes'} en total</p>
      </Widget>
    </div>
  );
}

// ---------- Sección del administrador ----------
function SeccionAdmin({ evaluaciones, alertas }) {
  const evals = [...evaluaciones.datos].sort((a, b) => new Date(b.fecha_evaluacion) - new Date(a.fecha_evaluacion)).slice(0, 8);
  const ultimas = [...(alertas?.datos || [])].sort((a, b) => new Date(b.fecha_generada) - new Date(a.fecha_generada)).slice(0, 6);
  return (
    <div className={`dash-grid ${alertas ? 'dash-grid--admin' : 'dash-grid--solo'}`}>
      <Widget titulo="Evaluaciones recientes" sub="Métricas de los modelos de IA" error={evaluaciones.error}
        vacio={evals.length === 0 && 'Todavía no hay evaluaciones de modelos.'}>
        <div className="tabla-wrap">
          <table className="tabla">
            <thead><tr><th>Entrenamiento</th><th>MAE</th><th>RMSE</th><th>R²</th><th>F1</th><th>Umbral</th></tr></thead>
            <tbody>
              {evals.map((e) => (
                <tr key={e.id_evaluacion}>
                  <td>#{e.id_entrenamiento}</td>
                  <td>{fmt(num(e.mae), 3)}</td><td>{fmt(num(e.rmse), 3)}</td><td>{fmt(num(e.r2), 3)}</td><td>{fmt(num(e.f1_score), 3)}</td>
                  <td>{e.supera_umbral ? <span className="pill st-good">✓ Supera</span> : <span className="pill st-bad">✕ No supera</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Widget>

      {alertas && <Widget titulo="Alertas" sub="Las más recientes" error={alertas.error} vacio={ultimas.length === 0 && 'No hay alertas.'}>
        <ul className="alertas">
          {ultimas.map((a) => (
            <li key={a.id_alerta} className={a.leida ? '' : 'nueva'}>
              <div><b>{a.tipo_alerta || 'Alerta'}</b><p>{a.mensaje}</p></div>
              <span className={`pill ${a.leida ? 'st-none' : 'st-warn'}`}>{a.leida ? 'Leída' : '● No leída'}</span>
            </li>
          ))}
        </ul>
      </Widget>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const esAdmin = user.rol === ROL_ADMIN;
  const veEvaluaciones = esAdmin || user.rol === ROL_INVESTIGADOR;
  const [base, setBase] = useState({ cargando: true });
  const [cosechas, setCosechas] = useState({ cargando: true, porTerreno: {} });
  const [seleccion, setSeleccion] = useState(null);

  useEffect(() => {
    const llamadas = [
      srv.obtenerTerrenos(),
      srv.obtenerCultivos(),
      esAdmin ? srv.obtenerAlertas() : null,
      esAdmin ? srv.obtenerModelos() : null,
      veEvaluaciones ? srv.obtenerEvaluaciones() : null,
    ];
    Promise.allSettled(llamadas).then(([t, c, a, m, e]) => {
      const terrenos = srv.resultado(t, 'No se pudieron cargar los terrenos');
      setBase({
        cargando: false, terrenos, cultivos: srv.resultado(c),
        alertas: esAdmin ? srv.resultado(a, 'No se pudieron cargar las alertas') : null,
        modelos: esAdmin ? srv.resultado(m, 'No se pudieron cargar los modelos') : null,
        evaluaciones: veEvaluaciones ? srv.resultado(e, 'No se pudieron cargar las evaluaciones') : null,
      });
      setSeleccion(terrenos.datos[0]?.id_terreno ?? null);
      Promise.allSettled(terrenos.datos.map((x) => srv.obtenerCosechas(x.id_terreno))).then((rs) => {
        const porTerreno = {};
        rs.forEach((r, i) => { porTerreno[terrenos.datos[i].id_terreno] = srv.resultado(r, 'No se pudieron cargar las cosechas'); });
        setCosechas({ cargando: false, porTerreno });
      });
    });
  }, [esAdmin, veEvaluaciones]);

  const terrenos = base.terrenos?.datos || [];
  const cultivoDe = useMemo(() => Object.fromEntries((base.cultivos?.datos || []).map((c) => [c.id_cultivo, c.nombre_cultivo])), [base.cultivos]);
  const todasCosechas = Object.values(cosechas.porTerreno).flatMap((r) => r.datos);
  const hectareas = terrenos.reduce((s, t) => s + (num(t.area_hectareas) || 0), 0);
  const rendProm = promedio(todasCosechas.map((c) => num(c.rendimiento_kg_ha)).filter((v) => v != null));
  const sinTerrenos = !base.cargando && !base.terrenos.error && terrenos.length === 0;
  const terrenoSel = terrenos.find((t) => t.id_terreno === seleccion);

  return (
    <>
      <section className="dash-head">
        <div>
          <div className="giza-eyebrow">🌱 Panel · <span style={{ textTransform: 'none' }}>{hoy()}</span></div>
          <h1 className="prof-name">Hola, <em className="c-lime" style={{ fontStyle: 'normal' }}>{user.nombre.split(' ')[0]}</em></h1>
        </div>
        <span className={`prof-badge${esAdmin ? ' prof-badge--admin' : ''}`}>{iconoRol(user.rol)} {etiquetaRol(user.rol)}</span>
      </section>

      <div className={`kpis${esAdmin ? ' kpis--6' : ''}`}>
        <Kpi icono="🗺️" etiqueta="Terrenos" cargando={base.cargando} error={base.terrenos?.error}
          valor={base.terrenos?.error ? null : terrenos.length} />
        <Kpi icono="📐" etiqueta="Hectáreas" unidad="ha" cargando={base.cargando}
          valor={terrenos.length ? fmt(hectareas, 2) : null} />
        <Kpi icono="🌾" etiqueta="Cosechas registradas" cargando={base.cargando || (terrenos.length > 0 && cosechas.cargando)}
          valor={terrenos.length ? todasCosechas.length : null} />
        <Kpi icono="📈" etiqueta="Rendimiento promedio" unidad="kg/ha" cargando={base.cargando || (terrenos.length > 0 && cosechas.cargando)}
          valor={rendProm != null ? fmt(rendProm, 0) : null} />
        {esAdmin && <>
          <Kpi icono="🔔" etiqueta="Alertas sin leer" cargando={base.cargando} error={base.alertas?.error}
            valor={base.alertas?.error ? null : base.alertas?.datos.filter((a) => !a.leida).length} />
          <Kpi icono="🤖" etiqueta="Modelos IA" cargando={base.cargando} error={base.modelos?.error}
            valor={base.modelos?.error ? null : base.modelos?.datos.length} />
        </>}
      </div>

      {base.cargando && <div className="dash-grid"><div className="skel skel--card" /><div className="skel skel--card" /></div>}
      {base.terrenos?.error && <div className="g-alert g-alert--error">{base.terrenos.error}</div>}

      {sinTerrenos && (
        <section className="app-card dash-empty">
          <span className="prof-empty__ico">🌱</span>
          <h3>Aún no hay datos para mostrar</h3>
          <p>Todavía no tienes terrenos asignados. Un administrador puede asignarte uno desde la gestión de usuarios.</p>
        </section>
      )}

      {terrenos.length > 0 && (
        <>
          <div className="dash-selector" role="tablist" aria-label="Terreno">
            {terrenos.map((t) => (
              <button key={t.id_terreno} type="button" role="tab" aria-selected={t.id_terreno === seleccion}
                className={`dash-pill${t.id_terreno === seleccion ? ' active' : ''}`} onClick={() => setSeleccion(t.id_terreno)}>
                {t.nombre}
                {cultivoDe[t.id_cultivo] && <small>{cultivoDe[t.id_cultivo]}</small>}
              </button>
            ))}
          </div>
          {terrenoSel && (cosechas.cargando
            ? <div className="dash-grid"><div className="skel skel--card" /><div className="skel skel--card" /></div>
            : <PanelTerreno key={terrenoSel.id_terreno} terreno={terrenoSel} cosechas={cosechas.porTerreno[terrenoSel.id_terreno] || { datos: [], error: '' }} />)}
        </>
      )}

      {veEvaluaciones && !base.cargando && <SeccionAdmin evaluaciones={base.evaluaciones} alertas={base.alertas} />}
    </>
  );
}
