-- Columnas que necesita el login/registro con JWT (auht.models.js).
-- Ejecutar una sola vez en phpMyAdmin (pestaña SQL) sobre la base ia_prediccion_cultivos.
--
-- password se crea como NULL para no romper la tabla si ya tiene usuarios: esos usuarios
-- no pueden iniciar sesión (el login responde 401) hasta que un admin les ponga password.
-- Cuando todos tengan password, se puede volver obligatoria con:
--   ALTER TABLE usuarios MODIFY password VARCHAR(255) NOT NULL;
--
-- Si ya ejecutaste la versión anterior de este archivo (con NOT NULL), no hace falta
-- volver a ejecutarlo.

USE ia_prediccion_cultivos;

ALTER TABLE usuarios
  ADD COLUMN password VARCHAR(255) NULL AFTER correo,
  ADD COLUMN ultimo_login DATETIME NULL AFTER fecha_registro;

-- Recomendado: el correo debe ser único (el registro ya lo comprueba, esto lo garantiza)
-- ALTER TABLE usuarios ADD UNIQUE INDEX uq_usuarios_correo (correo);
