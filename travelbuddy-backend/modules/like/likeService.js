const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const Like = require('./likeModel');
const Destination = require('../destination/destinationModel');
const User = require('../user/userModel');

function httpError(status, message) { const error = new Error(message); error.status = status; return error; }

async function toggleLike(userId, destinationId) {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) throw httpError(404, 'Destino não encontrado.');
  const result = await sequelize.transaction(async (transaction) => {
    const existing = await Like.findOne({ where: { userId, destinationId }, transaction, lock: transaction.LOCK.UPDATE });
    if (existing) {
      await existing.destroy({ transaction });
      await Destination.decrement('likesCount', { by: 1, where: { id: destinationId, likesCount: { [Op.gt]: 0 } }, transaction });
      return false;
    }
    await Like.create({ userId, destinationId }, { transaction });
    await Destination.increment('likesCount', { by: 1, where: { id: destinationId }, transaction });
    return true;
  });
  const updated = await Destination.findByPk(destinationId);
  return { liked: result, likesCount: updated.likesCount };
}

async function likeStatus(userId, destinationId) {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) throw httpError(404, 'Destino não encontrado.');
  return { isLiked: userId ? Boolean(await Like.findOne({ where: { userId, destinationId } })) : false, likesCount: destination.likesCount };
}

async function getLikedDestinations(userId) {
  const likes = await Like.findAll({ where: { userId }, attributes: ['destinationId'], order: [['createdAt', 'DESC']] });
  const ids = likes.map((like) => like.destinationId);
  if (!ids.length) return [];
  const destinations = await Destination.findAll({ where: { id: { [Op.in]: ids } }, include: [{ model: User, attributes: ['id', 'username', 'fullName', 'profilePicture'] }] });
  const order = new Map(ids.map((id, index) => [id, index]));
  return destinations.sort((a, b) => order.get(a.id) - order.get(b.id));
}

module.exports = { toggleLike, likeStatus, getLikedDestinations };
