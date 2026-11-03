const { controladorCrud } = require('../utils/controladorCrud');
const config = require('../models/Modelo.models');

module.exports = controladorCrud(config);
