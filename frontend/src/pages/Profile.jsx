import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerTerrenos } from '../services/auth';
import { iniciales } from '../components/AppLayout';
import { ROL_ADMIN, etiquetaRol, iconoRol } from '../utils/roles';

const formatoFecha = (valor) => {
  if (!valor) return null;
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return null;
  return fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};

function Dato({ icono, etiqueta, valor, vacio }) {
  return (
    <div className="prof-item">
      <span className="prof-item__ico">{icono}</span>
      <div style={{ minWidth: 0 }}>
        <small>{etiqueta}</small>
        {valor ? <b>{valor}</b> : <b className="empty">{vacio}</b>}
      </div>
    </div>
  );
}

function MisTerrenos() {
  const [estado, setEstado] = useState({ cargando: true, error: '', terrenos: [] });

  useEffect(() => {
    obtenerTerrenos()
      .then((data) => {
        const lista = Array.isArray(data) ? data : data?.datos || data?.terrenos || [];
        setEstado({ cargando: false, error: '', terrenos: lista });
      })
      .catch((err) =>
        setEstado({ cargando: false, terrenos: [], error: err.response?.data?.mensaje || 'No se pudieron cargar los terrenos' })
      );
  }, []);

  const { cargando, error, terrenos } = estado;

  return (
    <section className="app-card prof-terrenos">
      <div className="prof-terrenos__head">
        <div>
          <h3>Mis terrenos</h3>
          <p className="muted">Terrenos a los que tienes acceso en Giza</p>
        </div>
        {!cargando && !error && <span className="prof-count">{terrenos.length}</span>}
      </div>

      {cargando && <div className="prof-empty"><span className="spinner" /> Cargando terrenos…</div>}
      {error && <div className="g-alert g-alert--error">{error}</div>}
      {!cargando && !error && terrenos.length === 0 && (
        <div className="prof-empty">
          <span className="prof-empty__ico">🌱</span>
          <p>Todavía no tienes terrenos asignados. Un administrador puede asignarte uno.</p>
        </div>
      )}
      {terrenos.length > 0 && (
        <div className="terreno-grid">
          {terrenos.map((t) => (
            <article className="terreno" key={t.id_terreno}>
              <div className="terreno__top">
                <span className="terreno__ico">🗺️</span>
                <b>{t.nombre}</b>
              </div>
              <ul>
                <li><span>Área</span><b>{t.area_hectareas != null ? `${Number(t.area_hectareas)} ha` : '—'}</b></li>
                {t.altitud_msnm != null && <li><span>Altitud</span><b>{Number(t.altitud_msnm)} msnm</b></li>}
                {t.coordenadas_lat != null && t.coordenadas_lon != null && (
                  <li><span>Coordenadas</span><b>{Number(t.coordenadas_lat).toFixed(4)}, {Number(t.coordenadas_lon).toFixed(4)}</b></li>
                )}
              </ul>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const guardado = useLocation().state?.guardado;
  const esAdmin = user.rol === ROL_ADMIN;
  const desde = formatoFecha(user.fecha_registro);

  return (
    <>
      {guardado && <div className="g-alert g-alert--ok">✓ Tus cambios se guardaron correctamente.</div>}

      <section className="app-card prof-hero">
        <span className="prof-avatar">{iniciales(user.nombre)}</span>
        <div className="prof-hero__info">
          <div className="giza-eyebrow">🌱 Mi perfil</div>
          <h1 className="prof-name">{user.nombre}</h1>
          <div className="prof-meta">
            <span>{user.correo}</span>
            <span className={`prof-badge${esAdmin ? ' prof-badge--admin' : ''}`}>
              {iconoRol(user.rol)} {etiquetaRol(user.rol)}
            </span>
            {desde && <span>· Miembro desde {desde}</span>}
          </div>
        </div>
        <div className="prof-hero__actions">
          <Link to="/perfil/editar" className="g-btn g-btn--primary">✏️ Editar perfil</Link>
        </div>
      </section>

      <div className="prof-grid">
        <section className="app-card">
          <h3>Información personal</h3>
          <p className="muted">Los datos de tu cuenta en Giza</p>
          <div className="prof-data">
            <Dato icono="👤" etiqueta="Nombre" valor={user.nombre} />
            <Dato icono="✉️" etiqueta="Correo electrónico" valor={user.correo} />
            <Dato icono="📱" etiqueta="Teléfono" valor={user.telefono} vacio="Sin teléfono" />
            <Dato icono={iconoRol(user.rol)} etiqueta="Rol" valor={etiquetaRol(user.rol)} />
            <Dato icono="📅" etiqueta="Fecha de registro" valor={desde} vacio="Sin fecha" />
          </div>
        </section>

        <aside className="prof-side">
          <section className="app-card">
            <h3>Cuenta</h3>
            <p className="muted">Estado de tu sesión</p>
            <ul className="prof-list">
              <li><span>Estado</span><b><span className="dot-ok" />Activa</b></li>
              <li><span>ID de usuario</span><b>#{user.id_usuario}</b></li>
              <li><span>Permisos</span><b>{esAdmin ? 'Administrador' : 'Usuario'}</b></li>
            </ul>
          </section>
        </aside>
      </div>

      <MisTerrenos />
    </>
  );
}
