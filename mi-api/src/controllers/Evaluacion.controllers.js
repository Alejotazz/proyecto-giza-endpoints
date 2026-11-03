const { controladorCrud } = require('../utils/controladorCrud');
const config = require('../models/Evaluacion.models');

module.exports = controladorCrud(config);
