const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('Comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  destinationId: { type: DataTypes.INTEGER, allowNull: false },
  content: { type: DataTypes.STRING(500), allowNull: false }
}, { tableName: 'comments' });
