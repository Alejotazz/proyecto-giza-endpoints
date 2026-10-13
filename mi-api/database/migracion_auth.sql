-- Columnas que necesita el login/registro con JWT (auht.models.js).
-- Ejecutar una sola vez en phpMyAdmin (pestaña SQL) sobre la base ia_prediccion_cultivos.
-- Si la tabla usuarios ya tiene filas, primero cambiar NOT NULL por NULL en password.

USE ia_prediccion_cultivos;

ALTER TABLE usuarios
  ADD COLUMN password VARCHAR(255) NOT NULL AFTER correo,
  ADD COLUMN ultimo_login DATETIME NULL AFTER fecha_registro;
