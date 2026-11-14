const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { NOTIFICATION } = require('../../config/constants');

module.exports = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  actorId: { type: DataTypes.INTEGER, allowNull: false },
  type: { type: DataTypes.ENUM(...Object.values(NOTIFICATION.TYPES)), allowNull: false },
  destinationId: { type: DataTypes.INTEGER, allowNull: true },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'notifications', indexes: [
  { fields: ['user_id', 'is_read'], name: 'idx_notifications_user_read' },
  { fields: ['destination_id'], name: 'idx_notifications_destination' }
] });
