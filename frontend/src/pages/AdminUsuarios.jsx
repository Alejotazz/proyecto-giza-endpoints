import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { iniciales } from '../components/AppLayout';
import * as srv from '../services/admin';
import { ROLES, ROL_ADMIN, RELACIONES, RELACION_POR_DEFECTO, etiquetaRol, iconoRol, etiquetaRelacion } from '../utils/roles';
import '../styles/dashboard.css';
import '../styles/admin.css';

const fecha = (v) => {
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
};

// ---------- Terrenos de un usuario ----------
function TerrenoFila({ terreno, usuario, relacion, alCambiar }) {
  const [rol, setRol] = useState(RELACION_POR_DEFECTO);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const ejecutar = async (accion, porDefecto) => {
    setOcupado(true);
    setError('');
    try {
      await accion();
      await alCambiar();
    } catch (err) {
      setError(srv.mensajeError(err, porDefecto));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <li className="terr-fila">
      <div className="terr-fila__info">
        <b>{terreno.nombre}</b>
        {terreno.area_hectareas != null && <small>{Number(terreno.area_hectareas)} ha</small>}
      </div>
      {relacion ? (
        <div className="terr-fila__acc">
          <span className="pill st-good">{etiquetaRelacion(relacion)}</span>
          <button type="button" className="g-btn g-btn--ghost g-btn--sm" disabled={ocupado}
            onClick={() => ejecutar(() => srv.quitarTerreno(terreno.id_terreno, usuario.id_usuario), 'No se pudo quitar el terreno')}>
            {ocupado ? 'Quitando…' : 'Quitar'}
          </button>
        </div>
      ) : (
        <div className="terr-fila__acc">
          <select className="g-select" aria-label={`Relación con ${terreno.nombre}`} value={rol} onChange={(e) => setRol(e.target.value)} disabled={ocupado}>
            {RELACIONES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <button type="button" className="g-btn g-btn--primary g-btn--sm" disabled={ocupado}
            onClick={() => ejecutar(() => srv.asignarTerreno(terreno.id_terreno, usuario.id_usuario, rol), 'No se pudo asignar el terreno')}>
            {ocupado ? 'Asignando…' : 'Asignar'}
          </button>
        </div>
      )}
      {error && <div className="g-alert g-alert--error terr-fila__error">{error}</div>}
    </li>
  );
}

// ---------- Tarjeta de un usuario ----------
function TarjetaUsuario({ usuario, esYo, terrenos, asignaciones, alActualizar, alEliminar, recargarAsignaciones }) {
  const [guardandoRol, setGuardandoRol] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [verTerrenos, setVerTerrenos] = useState(false);
  const [error, setError] = useState('');

  const cambiarRol = async (e) => {
    setGuardandoRol(true);
    setError('');
    try {
      alActualizar(await srv.cambiarRol(usuario.id_usuario, e.target.value));
    } catch (err) {
      setError(srv.mensajeError(err, 'No se pudo cambiar el rol'));
    } finally {
      setGuardandoRol(false);
    }
  };

  const eliminar = async () => {
    setEliminando(true);
    setError('');
    try {
      await srv.eliminarUsuario(usuario.id_usuario);
      alEliminar(usuario.id_usuario);
    } catch (err) {
      setError(srv.mensajeError(err, 'No se pudo eliminar el usuario'));
      setEliminando(false);
      setConfirmando(false);
    }
  };

  const relacionEn = (idTerreno) =>
    (asignaciones[idTerreno] || []).find((a) => a.id_usuario === usuario.id_usuario)?.rol_relacion;
  const cantidad = terrenos.filter((t) => relacionEn(t.id_terreno)).length;

  return (
    <article className="usuario">
      <div className="usuario__fila">
        <span className="app-user__avatar usuario__avatar">{iniciales(usuario.nombre)}</span>
        <div className="usuario__datos">
          <b>{usuario.nombre}{esYo && <em> (tú)</em>}</b>
          <small>{usuario.correo}</small>
        </div>
        <span className={`prof-badge${usuario.rol === ROL_ADMIN ? ' prof-badge--admin' : ''}`}>{iconoRol(usuario.rol)} {etiquetaRol(usuario.rol)}</span>
        <small className="usuario__fecha">Desde {fecha(usuario.fecha_registro)}</small>
        <div className="usuario__acciones">
          <select className="g-select" aria-label={`Rol de ${usuario.nombre}`} value={usuario.rol} onChange={cambiarRol}
            disabled={esYo || guardandoRol} title={esYo ? 'No puedes cambiar tu propio rol' : undefined}>
            {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
          </select>
          <button type="button" className="g-btn g-btn--ghost g-btn--sm" aria-expanded={verTerrenos} onClick={() => setVerTerrenos((v) => !v)}>
            🗺️ Terrenos ({cantidad})
          </button>
          {!esYo && !confirmando && (
            <button type="button" className="g-btn g-btn--danger g-btn--sm" onClick={() => setConfirmando(true)}>Eliminar</button>
          )}
        </div>
      </div>

      {confirmando && (
        <div className="usuario__confirmar" role="alert">
          <span>¿Eliminar a <b>{usuario.nombre}</b>? Esta acción no se puede deshacer.</span>
          <div>
            <button type="button" className="g-btn g-btn--ghost g-btn--sm" disabled={eliminando} onClick={() => setConfirmando(false)}>Cancelar</button>
            <button type="button" className="g-btn g-btn--danger g-btn--sm" disabled={eliminando} onClick={eliminar}>
              {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}

      {error && <div className="g-alert g-alert--error">{error}</div>}

      {verTerrenos && (
        <div className="usuario__terrenos">
          <h4>Terrenos asignados</h4>
          {terrenos.length === 0
            ? <p className="muted">Todavía no hay terrenos. Crea uno con el formulario “Nuevo terreno”.</p>
            : (
              <ul className="terr-lista">
                {terrenos.map((t) => (
                  <TerrenoFila key={t.id_terreno} terreno={t} usuario={usuario} relacion={relacionEn(t.id_terreno)} alCambiar={recargarAsignaciones} />
                ))}
              </ul>
            )}
        </div>
      )}
    </article>
  );
}

// ---------- Formularios ----------
function NuevoCultivo({ alCrear }) {
  const [nombre, setNombre] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setOcupado(true);
    setError('');
    try {
      alCrear(await srv.crearCultivo(nombre.trim()));
      setNombre('');
    } catch (err) {
      setError(srv.mensajeError(err, 'No se pudo crear el cultivo'));
    } finally {
      setOcupado(false);
    }
  };

  return (
    <form className="app-card" onSubmit={enviar}>
      <h3>Nuevo cultivo</h3>
      <p className="muted">Necesitas al menos un cultivo para crear terrenos.</p>
      <div className="g-field">
        <label htmlFor="nuevo-cultivo">Nombre del cultivo</label>
        <div className="g-input g-input--plain">
          <input id="nuevo-cultivo" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Café" maxLength={50} required />
        </div>
      </div>
      {error && <div className="g-alert g-alert--error">{error}</div>}
      <button type="submit" className="g-btn g-btn--primary g-btn--block" disabled={ocupado}>{ocupado ? 'Creando…' : '🌱 Crear cultivo'}</button>
    </form>
  );
}

const TERRENO_VACIO = { nombre: '', id_cultivo: '', area_hectareas: '', coordenadas_lat: '', coordenadas_lon: '' };

function NuevoTerreno({ cultivos, alCrear }) {
  const [form, setForm] = useState(TERRENO_VACIO);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setOcupado(true);
    setError('');
    const terreno = { nombre: form.nombre.trim(), id_cultivo: Number(form.id_cultivo) };
    ['area_hectareas', 'coordenadas_lat', 'coordenadas_lon'].forEach((c) => {
      if (form[c] !== '') terreno[c] = Number(form[c]);
    });
    try {
      alCrear(await srv.crearTerreno(terreno));
      setForm(TERRENO_VACIO);
    } catch (err) {
      setError(srv.mensajeError(err, 'No se pudo crear el terreno'));
    } finally {
      setOcupado(false);
    }
  };

  const numero = (name, label, extra) => (
    <div className="g-field">
      <label htmlFor={`t-${name}`}>{label}</label>
      <div className="g-input g-input--plain">
        <input id={`t-${name}`} name={name} type="number" step="any" value={form[name]} onChange={onChange} {...extra} />
      </div>
    </div>
  );

  return (
    <form className="app-card" onSubmit={enviar}>
      <h3>Nuevo terreno</h3>
      <p className="muted">Después asígnalo a un usuario desde su tarjeta.</p>
      <div className="g-field">
        <label htmlFor="t-nombre">Nombre</label>
        <div className="g-input g-input--plain">
          <input id="t-nombre" name="nombre" value={form.nombre} onChange={onChange} placeholder="Finca La Esperanza" maxLength={150} required />
        </div>
      </div>
      <div className="g-field">
        <label htmlFor="t-cultivo">Cultivo</label>
        <select id="t-cultivo" className="g-select g-select--block" name="id_cultivo" value={form.id_cultivo} onChange={onChange} required disabled={cultivos.length === 0}>
          <option value="">{cultivos.length ? 'Elige un cultivo' : 'Primero crea un cultivo'}</option>
          {cultivos.map((c) => <option key={c.id_cultivo} value={c.id_cultivo}>{c.nombre_cultivo}</option>)}
        </select>
      </div>
      {numero('area_hectareas', 'Área (hectáreas, opcional)', { min: 0, placeholder: '12.5' })}
      <div className="g-row">
        {numero('coordenadas_lat', 'Latitud (opcional)', { min: -90, max: 90, placeholder: '2.5359' })}
        {numero('coordenadas_lon', 'Longitud (opcional)', { min: -180, max: 180, placeholder: '-75.5277' })}
      </div>
      {error && <div className="g-alert g-alert--error">{error}</div>}
      <button type="submit" className="g-btn g-btn--primary g-btn--block" disabled={ocupado || cultivos.length === 0}>
        {ocupado ? 'Creando…' : '🗺️ Crear terreno'}
      </button>
    </form>
  );
}

// ---------- Página ----------
export default function AdminUsuarios() {
  const { user } = useAuth();
  const [estado, setEstado] = useState({ cargando: true, error: '', usuarios: [], terrenos: [], cultivos: [] });
  const [asignaciones, setAsignaciones] = useState({});

  const cargarAsignaciones = useCallback(async (terrenos) => {
    const rs = await Promise.allSettled(terrenos.map((t) => srv.usuariosDeTerreno(t.id_terreno)));
    const mapa = {};
    rs.forEach((r, i) => { mapa[terrenos[i].id_terreno] = r.status === 'fulfilled' ? r.value : []; });
    setAsignaciones(mapa);
  }, []);

  useEffect(() => {
    Promise.allSettled([srv.listarUsuarios(), srv.listarTerrenos(), srv.listarCultivos()]).then(async ([u, t, c]) => {
      const fallo = [u, t, c].find((r) => r.status === 'rejected');
      const terrenos = t.status === 'fulfilled' ? t.value : [];
      setEstado({
        cargando: false,
        error: fallo ? srv.mensajeError(fallo.reason, 'No se pudo cargar la información') : '',
        usuarios: u.status === 'fulfilled' ? u.value : [],
        terrenos,
        cultivos: c.status === 'fulfilled' ? c.value : [],
      });
      await cargarAsignaciones(terrenos);
    });
  }, [cargarAsignaciones]);

  const { cargando, error, usuarios, terrenos, cultivos } = estado;
  const parchar = (cambios) => setEstado((e) => ({ ...e, ...cambios(e) }));

  return (
    <>
      <section className="dash-head">
        <div>
          <div className="giza-eyebrow">⚙️ Administración</div>
          <h1 className="prof-name">Usuarios</h1>
        </div>
        {!cargando && <span className="prof-count">{usuarios.length}</span>}
      </section>

      {error && <div className="g-alert g-alert--error">{error}</div>}

      <div className="admin-grid">
        <section className="admin-usuarios">
          {cargando && <><div className="skel skel--usuario" /><div className="skel skel--usuario" /></>}
          {!cargando && usuarios.length === 0 && !error && (
            <div className="app-card dash-empty"><p>No hay usuarios registrados.</p></div>
          )}
          {usuarios.map((u) => (
            <TarjetaUsuario key={u.id_usuario} usuario={u} esYo={u.id_usuario === user.id_usuario}
              terrenos={terrenos} asignaciones={asignaciones}
              alActualizar={(nuevo) => parchar((e) => ({ usuarios: e.usuarios.map((x) => (x.id_usuario === nuevo.id_usuario ? nuevo : x)) }))}
              alEliminar={(id) => { parchar((e) => ({ usuarios: e.usuarios.filter((x) => x.id_usuario !== id) })); cargarAsignaciones(terrenos); }}
              recargarAsignaciones={() => cargarAsignaciones(terrenos)} />
          ))}
        </section>

        <aside className="admin-side">
          {!cargando && cultivos.length === 0 && (
            <NuevoCultivo alCrear={(c) => parchar((e) => ({ cultivos: [...e.cultivos, c] }))} />
          )}
          {!cargando && (
            <NuevoTerreno cultivos={cultivos} alCrear={(t) => {
              const lista = [...terrenos, t];
              parchar(() => ({ terrenos: lista }));
              cargarAsignaciones(lista);
            }} />
          )}
        </aside>
      </div>
    </>
  );
}
