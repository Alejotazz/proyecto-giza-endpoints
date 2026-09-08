const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Parcela = sequelize.define('Parcela', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  cultivo: { type: DataTypes.ENUM('arroz', 'cafe'), allowNull: false },
  geometria: { type: DataTypes.GEOMETRY('POLYGON', 4326), allowNull: false },
  usuarioId: { type: DataTypes.UUID, allowNull: false },
});

module.exports = Parcela;