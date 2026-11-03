# Cambios del 3 de noviembre de 2026: correcciones de la revisión

Correcciones de seguridad y errores del backend (`mi-api`). El frontend no necesita cambios: login, registro, perfil y editar perfil siguen funcionando igual.

## Lo que cambia para quien usa la API

- **Permisos por terreno.** Un usuario solo ve y edita los terrenos a los que está asignado en `terrenos_usuarios`, junto con sus cosechas, clima, muestras, imágenes y dataset. El admin ve todo.
- **Solo el admin** puede crear y borrar terrenos (después asigna usuarios con `POST /api/terrenos/:id/usuarios`). También es el único que modifica modelos, entrenamientos, evaluaciones y el dataset completo, y el único que accede a alertas y retroalimentación.
  - Las alertas quedaron solo para el admin porque no se sabe cómo se une una predicción con su terreno. Ver el TODO en `src/routes/Alerta.routes.js`.
- **Los PUT son parciales.** Los campos que no envías conservan su valor; antes quedaban en NULL.
- **Validación de datos.** Datos inválidos devuelven 400 con una lista `errores`. Un id que no existe devuelve 404. Un correo duplicado devuelve 409.
- **Mensajes de error.** Los errores de la base de datos ya no se envían al cliente.
- **Límites en login y registro.** Se permiten 20 intentos por IP cada 15 minutos. El correo debe tener formato válido y el password entre 6 y 72 caracteres.
- **Cambios de rol inmediatos.** Si un usuario se borra o cambia de rol, su token deja de dar los permisos viejos al instante.
- Un admin no puede borrarse ni cambiarse el rol a sí mismo. Los roles válidos son `administrador` y `agricultor`; se configuran con `ROLES` en `.env`.
- `url_archivo` de imágenes solo acepta `http://` o `https://`.
- Paginación opcional en los listados: `?limite=50&pagina=2`. Sin `limite`, se devuelve todo como antes.
- Nuevo endpoint `GET /api/salud`: responde 200 si la API y la base de datos están bien.

## Arreglos de configuración

- Se agregó `helmet` (cabeceras de seguridad) y se usa `express-rate-limit`, que ya estaba instalado.
- Los orígenes de CORS se pueden configurar con `CORS_ORIGINS` en `.env`.
- El puerto por defecto ahora es 3000. Antes era 3306, que choca con MySQL.
- Ejecuté `npm audit fix` en `mi-api`. Quedan dos avisos moderados: `uuid` dentro de `sequelize` (solo lo usan los archivos de parcelas, que no están montados) y `nodemon` (solo desarrollo). Ninguno tiene arreglo sin cambios grandes.
- `migracion_auth.sql` crea `password` como NULL, para que no falle con usuarios ya existentes.
- `README.md` se guardó en UTF-8.
- `mi-api/.env.example` incluye las variables opcionales nuevas.

## Pruebas

`npm test` (dentro de `mi-api`) ejecuta 12 pruebas contra la base de datos configurada en `.env`. **Usa una base de PRUEBA**, porque las pruebas crean y borran datos. Pasaron 12 de 12 en MariaDB, con tablas creadas a partir de las columnas que usa el código.

## Pendiente

- `parcela.*` y `prediccion.*` siguen sin montarse. Usan Sequelize y multer, que no están instalados, y fallan al cargarse.
- Conviene agregar un índice único en `usuarios.correo`. Está comentado al final de la migración.
- Cultivos usan `nombre_cultivo`, como en tu base.
