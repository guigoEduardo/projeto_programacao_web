const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('Like', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  destinationId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'likes',
  indexes: [{ unique: true, fields: ['user_id', 'destination_id'], name: 'idx_likes_user_destination' }]
});
