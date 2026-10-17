const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Destination = sequelize.define('Destination',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING(500), allowNull: true },
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
