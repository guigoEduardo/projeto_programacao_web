const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const { VALIDATION } = require('../../config/constants');

const Destination = sequelize.define('Destination',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(VALIDATION.TITLE_MAX), allowNull: false },
    description: { type: DataTypes.STRING(VALIDATION.DESCRIPTION_MAX), allowNull: true },
    category: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    viewsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    likesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    commentsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
  },
  {
    timestamps: true,
    tableName: 'destinations'
  }
);

module.exports = Destination;
