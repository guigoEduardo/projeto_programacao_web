const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { REPORT } = require('../../config/constants');

module.exports = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  destinationId: { type: DataTypes.INTEGER, allowNull: false },
  reason: { type: DataTypes.ENUM(...REPORT.REASONS), allowNull: false },
  status: { type: DataTypes.ENUM(...Object.values(REPORT.STATUS)), allowNull: false, defaultValue: REPORT.STATUS.PENDING },
  reviewedAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'reports', indexes: [
  { unique: true, fields: ['user_id', 'destination_id'], name: 'idx_unique_user_destination_report' },
  { fields: ['destination_id'], name: 'idx_reports_destination' },
  { fields: ['status'], name: 'idx_reports_status' }
] });
