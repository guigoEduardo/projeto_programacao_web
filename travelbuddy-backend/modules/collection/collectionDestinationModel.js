const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
module.exports = sequelize.define('CollectionDestination', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  collectionId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'collections', key: 'id' }, onDelete: 'CASCADE' },
  destinationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'destinations', key: 'id' }, onDelete: 'CASCADE' }
}, { tableName: 'collection_destinations', indexes: [
  { name: 'idx_collection_destination_pair', unique: true, fields: ['collection_id', 'destination_id'] },
  { name: 'idx_collection_destination_destination', fields: ['destination_id'] }
] });
