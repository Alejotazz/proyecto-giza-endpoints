const crud = require('./crud');
const { validar, validarId } = require('./validar');
const { noEncontrado } = require('./errores');

// Genera los handlers CRUD de una tabla simple.
//   tabla, id            -> nombre de la tabla y de su clave primaria
//   esquema              -> reglas de validación (ver utils/validar.js)
//   esquemaUpdate        -> opcional, campos permitidos en el PUT (por defecto = esquema)
//   que                  -> nombre para los mensajes ("Modelo", "Alerta"...)
//   padre                -> opcional { param, columna }: para rutas anidadas como
//                           /modelos/:id_modelo/entrenamientos (columna = id_modelo)
function controladorCrud({ tabla, id, esquema, esquemaUpdate = esquema, que, padre }) {
  const leerPadre = (req) => validarId(req.params[padre.param], padre.param);

  return {
    listar: async (req, res) => {
      res.json(await crud.listar(tabla, { query: req.query, orden: id }));
    },

    listarPorPadre: async (req, res) => {
      res.json(await crud.listar(tabla, {
        where: `${padre.columna} = ?`, params: [leerPadre(req)], query: req.query, orden: id,
      }));
    },

    obtener: async (req, res) => {
      const fila = await crud.obtener(tabla, id, validarId(req.params.id));
      if (!fila) throw noEncontrado(que);
      res.json(fila);
    },

    crear: async (req, res) => {
      const datos = validar(esquema, req.body);
      if (padre) datos[padre.columna] = leerPadre(req);
      res.status(201).json(await crud.crear(tabla, id, datos));
    },

    actualizar: async (req, res) => {
      const datos = validar(esquemaUpdate, req.body, { parcial: true });
      const fila = await crud.actualizar(tabla, id, validarId(req.params.id), datos);
      if (!fila) throw noEncontrado(que);
      res.json(fila);
    },

    eliminar: async (req, res) => {
      const borrado = await crud.eliminar(tabla, id, validarId(req.params.id));
      if (!borrado) throw noEncontrado(que);
      res.status(204).send();
    },
  };
}

module.exports = { controladorCrud };
