const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define('Follow', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  followerId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  followingId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } }
}, {
  tableName: 'follows',
  indexes: [
    { name: 'idx_follows_pair', unique: true, fields: ['follower_id', 'following_id'] },
    { name: 'idx_follows_following', fields: ['following_id'] }
  ]
});
