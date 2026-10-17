const sequelize = require('../../config/database');
const Comment = require('./commentModel');
const Destination = require('../destination/destinationModel');
const User = require('../user/userModel');

function httpError(status, message) { const error = new Error(message); error.status = status; return error; }

async function listComments(destinationId) {
  if (!await Destination.findByPk(destinationId)) throw httpError(404, 'Destino não encontrado.');
  return Comment.findAll({ where: { destinationId }, include: [{ model: User, attributes: ['id', 'username', 'fullName', 'profilePicture'] }], order: [['createdAt', 'DESC']] });
}

async function createComment(userId, destinationId, content) {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) throw httpError(404, 'Destino não encontrado.');
  const comment = await sequelize.transaction(async (transaction) => {
    const created = await Comment.create({ userId, destinationId, content }, { transaction });
    await Destination.increment('commentsCount', { by: 1, where: { id: destinationId }, transaction });
    return created;
  });
  return Comment.findByPk(comment.id, { include: [{ model: User, attributes: ['id', 'username', 'fullName', 'profilePicture'] }] });
}

module.exports = { listComments, createComment };
