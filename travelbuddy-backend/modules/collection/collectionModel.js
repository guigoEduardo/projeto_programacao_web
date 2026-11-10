const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');
module.exports = sequelize.define('Collection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(VALIDATION.COLLECTION_TITLE_MAX), allowNull: false },
  description: { type: DataTypes.STRING(VALIDATION.COLLECTION_DESCRIPTION_MAX), allowNull: true },
  isPublic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  destinationsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
}, { tableName: 'collections', indexes: [{ name: 'idx_collections_user', fields: ['user_id'] }] });
