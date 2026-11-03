const { controladorCrud } = require('../utils/controladorCrud');
const config = require('../models/Entrenamiento.models');

module.exports = controladorCrud(config);
