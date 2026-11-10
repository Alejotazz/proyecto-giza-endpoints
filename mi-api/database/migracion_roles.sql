-- Agrega el rol 'empresa' a usuarios.rol.
-- Ejecutar una sola vez en phpMyAdmin (pestaña SQL) sobre la base ia_prediccion_cultivos.
--
-- Solo se AGREGA un valor al final del ENUM: los valores existentes no se borran ni se
-- renombran, así que los usuarios actuales conservan su rol.
--
-- Roles de la aplicación: administrador, agricultor, agronomo, investigador, empresa.

USE ia_prediccion_cultivos;

ALTER TABLE usuarios
  MODIFY rol ENUM('agricultor', 'agronomo', 'investigador', 'administrador', 'empresa')
  NOT NULL DEFAULT 'agricultor';
