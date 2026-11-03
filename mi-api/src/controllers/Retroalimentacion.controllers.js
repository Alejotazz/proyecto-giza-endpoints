const { controladorCrud } = require('../utils/controladorCrud');
const config = require('../models/Retroalimentacion.models');

module.exports = controladorCrud(config);
