# Despliegue de Giza: Aiven + Render + Vercel

| Parte | Servicio | Carpeta del repositorio |
|---|---|---|
| Base de datos MySQL | Aiven | — |
| API (Express) | Render | `mi-api` |
| Frontend (React + Vite) | Vercel | `frontend` |

Orden recomendado: **Aiven → Render → Vercel → volver a Render para CORS**.

> El repositorio es de `Alejotazz`. Render y Vercel piden instalar su app de GitHub en él:
> el dueño tiene que autorizarlo, o se hace un fork en otra cuenta.

---

## 1. Aiven (MySQL)

1. Crea un servicio **MySQL** (plan gratis) y espera a que diga *Running*.
2. En **Overview → Connection information** anota: Host, Port, User, Password y Database
   (normalmente `defaultdb`). Descarga el **CA certificate** (`ca.pem`).
3. Carga la estructura y los datos de Giza:
   1. Crea `mi-api/.env.aiven` (no se sube a GitHub) con:
      ```
      DB_HOST=<host de Aiven>
      DB_PORT=<puerto de Aiven>
      DB_USER=avnadmin
      DB_PASSWORD=<contraseña de Aiven>
      DB_NAME=defaultdb
      DB_SSL=true
      DB_SSL_CA_PATH=C:/ruta/a/ca.pem
      ```
   2. Desde `mi-api`, en PowerShell:
      ```
      Copy-Item .env .env.local-xampp
      Copy-Item .env.aiven .env
      npm.cmd run importar-sql -- C:\Users\Andres\giza-backups\giza-para-aiven-2026-11-10.sql
      Copy-Item .env.local-xampp .env
      ```
      Debe decir `Listo: ... Tablas: 15`. El último comando deja otra vez tu `.env` de XAMPP.
   3. Si empiezas sin datos, crea el primer administrador (con el `.env` de Aiven activo):
      `npm.cmd run hacer-admin -- tu-correo@ejemplo.com`

## 2. Render (API)

1. **New → Web Service** → elige el repositorio y la rama.
2. Configuración:
   - **Root Directory:** `mi-api`  ← importante: en la raíz hay otro `package.json` que no sirve
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Secret Files**: agrega un archivo llamado `ca.pem` con el contenido del certificado de Aiven.
   Render lo deja en `/etc/secrets/ca.pem`.
4. **Environment Variables**:

   | Variable | Valor |
   |---|---|
   | `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | los de Aiven |
   | `DB_SSL` | `true` |
   | `DB_SSL_CA_PATH` | `/etc/secrets/ca.pem` |
   | `JWT_SECRET` | un texto largo y **nuevo** (no el de tu PC). Genera uno con: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `JWT_EXPIRES_IN` | `8h` |
   | `TRUST_PROXY` | `1` |
   | `CORS_ORIGINS` | la dirección de Vercel (paso 3), por ejemplo `https://giza.vercel.app` |

   No hace falta `PORT`: Render lo pone solo.
5. Despliega y prueba `https://<tu-api>.onrender.com/api/salud` → debe responder
   `{"estado":"ok","baseDeDatos":"ok"}`.
   En el plan gratis la API "se duerme" tras un rato sin uso: la primera petición tarda unos segundos.

## 3. Vercel (frontend)

1. **Add New → Project** → mismo repositorio.
2. **Root Directory:** `frontend` (Vercel detecta Vite: build `npm run build`, salida `dist`).
3. **Environment Variables:** `VITE_API_URL` = `https://<tu-api>.onrender.com/api`
4. Despliega. `frontend/vercel.json` hace que `/login`, `/dashboard`, etc. funcionen al recargar.
5. Vuelve a Render, pon la dirección de Vercel en `CORS_ORIGINS` y redespliega la API.

## Problemas comunes

| Síntoma | Causa |
|---|---|
| `/api/salud` da `baseDeDatos: "sin conexión"` | datos de Aiven mal copiados, falta `DB_SSL=true` o el certificado |
| En el navegador: error de CORS | `CORS_ORIGINS` no coincide exactamente con la dirección de Vercel (sin `/` al final) |
| 404 al recargar una página | falta `frontend/vercel.json` o el Root Directory no es `frontend` |
| El login se bloquea para todos tras pocos intentos | falta `TRUST_PROXY=1` en Render |
| Cambié `VITE_API_URL` y no pasa nada | en Vercel hay que redesplegar: la variable se usa al compilar |
