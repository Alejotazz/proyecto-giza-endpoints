import { useState } from 'react';

// Gráficas en SVG hechas a mano (sin librerías). Colores desde los tokens CSS del dashboard.
const W = 560;
const H = 220;
const M = { top: 16, right: 16, bottom: 34, left: 46 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;

const fmt = (n, dec = 1) =>
  n == null || Number.isNaN(n) ? '—' : Number(n).toLocaleString('es-CO', { maximumFractionDigits: dec });

// Marcas "bonitas" para el eje Y
function ticks(min, max, n = 4) {
  if (min === max) { max = min + 1; }
  const paso0 = (max - min) / n;
  const mag = 10 ** Math.floor(Math.log10(paso0));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((p) => p >= paso0);
  const ini = Math.floor(min / paso) * paso;
  const out = [];
  for (let v = ini; v <= max + paso * 0.001; v += paso) out.push(+v.toFixed(6));
  if (out[out.length - 1] < max) out.push(out[out.length - 1] + paso);
  return out;
}

function Ejes({ y, valores, unidad, etiquetasX }) {
  return (
    <g className="ch-axis">
      {valores.map((v) => (
        <g key={v}>
          <line x1={M.left} x2={W - M.right} y1={y(v)} y2={y(v)} className="ch-grid" />
          <text x={M.left - 8} y={y(v)} dy="0.32em" textAnchor="end">{fmt(v, 0)}</text>
        </g>
      ))}
      <text x={12} y={M.top + IH / 2} transform={`rotate(-90 12 ${M.top + IH / 2})`} textAnchor="middle" className="ch-unit">{unidad}</text>
      {etiquetasX.map(({ x, t }, i) => (
        <text key={i} x={x} y={H - M.bottom + 18} textAnchor="middle">{t}</text>
      ))}
    </g>
  );
}

function Tooltip({ punto }) {
  if (!punto) return null;
  const izq = punto.x / W > 0.6;
  return (
    <div className="ch-tip" style={{ left: `${(punto.x / W) * 100}%`, top: `${(punto.y / H) * 100}%`, transform: `translate(${izq ? 'calc(-100% - 10px)' : '10px'}, -50%)` }}>
      <b>{punto.titulo}</b>
      {punto.filas.map((f) => (
        <span key={f.k}>{f.color && <i style={{ background: f.color }} />}{f.k}: <b>{f.v}</b></span>
      ))}
    </div>
  );
}

// Barras verticales (una serie). datos: [{ etiqueta, valor }]
export function GraficoBarras({ datos, unidad, color = 'var(--ch-1)', titulo }) {
  const [hover, setHover] = useState(null);
  const max = Math.max(...datos.map((d) => d.valor), 0);
  const marcas = ticks(0, max || 1);
  const top = marcas[marcas.length - 1];
  const y = (v) => M.top + IH - (v / top) * IH;
  const banda = IW / datos.length;
  const ancho = Math.min(48, banda * 0.62);
  const cada = Math.ceil(datos.length / 8);

  return (
    <div className="ch-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={titulo} onMouseLeave={() => setHover(null)}>
        <Ejes y={y} valores={marcas} unidad={unidad}
          etiquetasX={datos.map((d, i) => ({ x: M.left + banda * i + banda / 2, t: i % cada === 0 ? d.etiqueta : '' }))} />
        {datos.map((d, i) => {
          const x = M.left + banda * i + (banda - ancho) / 2;
          const h = Math.max(0, y(0) - y(d.valor));
          const r = Math.min(4, ancho / 2, h);
          const activo = hover?.i === i;
          return (
            <g key={i} onMouseEnter={() => setHover({ i, x: x + ancho / 2, y: y(d.valor), titulo: d.etiqueta, filas: [{ k: titulo, v: `${fmt(d.valor)} ${unidad}` }] })}>
              <rect x={M.left + banda * i} y={M.top} width={banda} height={IH} fill="transparent" />
              <path d={`M${x},${y(0)} V${y(0) - h + r} Q${x},${y(0) - h} ${x + r},${y(0) - h} H${x + ancho - r} Q${x + ancho},${y(0) - h} ${x + ancho},${y(0) - h + r} V${y(0)} Z`}
                fill={color} opacity={hover && !activo ? 0.45 : 1} />
            </g>
          );
        })}
        <line x1={M.left} x2={W - M.right} y1={y(0)} y2={y(0)} className="ch-base" />
      </svg>
      <Tooltip punto={hover} />
    </div>
  );
}

// Líneas (varias series, mismo eje). series: [{ nombre, color, valores: [n|null] }], etiquetas: [string]
export function GraficoLineas({ etiquetas, series, unidad, titulo }) {
  const [hover, setHover] = useState(null);
  const todos = series.flatMap((s) => s.valores).filter((v) => v != null);
  const marcas = ticks(Math.min(...todos, 0) < 0 ? Math.min(...todos) : Math.floor(Math.min(...todos) - 1), Math.max(...todos));
  const lo = marcas[0];
  const hi = marcas[marcas.length - 1];
  const y = (v) => M.top + IH - ((v - lo) / (hi - lo)) * IH;
  const paso = etiquetas.length > 1 ? IW / (etiquetas.length - 1) : 0;
  const x = (i) => M.left + (etiquetas.length > 1 ? paso * i : IW / 2);
  const cada = Math.ceil(etiquetas.length / 6);

  const camino = (vals) => vals.reduce((acc, v, i) => (v == null ? acc : `${acc}${acc && vals[i - 1] != null ? 'L' : 'M'}${x(i)},${y(v)}`), '');

  const mover = (e) => {
    const svg = e.currentTarget;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.max(0, Math.min(etiquetas.length - 1, Math.round((px - M.left) / (paso || 1))));
    const ys = series.map((s) => s.valores[i]).filter((v) => v != null);
    setHover({ i, x: x(i), y: ys.length ? y(Math.max(...ys)) : M.top + IH / 2, titulo: etiquetas[i],
      filas: series.map((s) => ({ k: s.nombre, color: s.color, v: `${fmt(s.valores[i])} ${unidad}` })) });
  };

  return (
    <div className="ch-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={titulo} onMouseMove={mover} onMouseLeave={() => setHover(null)}>
        <Ejes y={y} valores={marcas} unidad={unidad}
          etiquetasX={etiquetas.map((t, i) => ({ x: x(i), t: i % cada === 0 ? t : '' }))} />
        {hover && <line x1={hover.x} x2={hover.x} y1={M.top} y2={M.top + IH} className="ch-cross" />}
        {series.map((s) => (
          <g key={s.nombre}>
            <path d={camino(s.valores)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            {hover && s.valores[hover.i] != null && (
              <circle cx={x(hover.i)} cy={y(s.valores[hover.i])} r="5" fill={s.color} stroke="var(--g-card)" strokeWidth="2" />
            )}
          </g>
        ))}
        <rect x={M.left} y={M.top} width={IW} height={IH} fill="transparent" />
      </svg>
      <Tooltip punto={hover} />
    </div>
  );
}

export function Leyenda({ items }) {
  return (
    <div className="ch-legend">
      {items.map((it) => (
        <span key={it.nombre}><i style={{ background: it.color }} />{it.nombre}</span>
      ))}
    </div>
  );
}

// Escala de pH 0–14 con marcador
export function EscalaPH({ valor }) {
  const pct = Math.max(0, Math.min(14, valor)) / 14 * 100;
  const zona = valor < 5.5 ? 'Ácido' : valor <= 7.5 ? 'Óptimo' : 'Alcalino';
  return (
    <div className="ph">
      <div className="ph__bar">
        <span className="ph__mark" style={{ left: `${pct}%` }}><b>{fmt(valor)}</b></span>
      </div>
      <div className="ph__scale"><span>0 · ácido</span><span>7 · neutro</span><span>14 · alcalino</span></div>
      <p className="ph__zona">pH {fmt(valor)} — <b>{zona}</b></p>
    </div>
  );
}

export { fmt };
