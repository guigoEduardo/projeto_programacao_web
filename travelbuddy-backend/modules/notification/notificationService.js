const Notification = require('./notificationModel');
const User = require('../user/userModel');
const Destination = require('../destination/destinationModel');

function httpError(status, message) { return Object.assign(new Error(message), { status }); }
async function createNotification({ userId, actorId, type, destinationId = null }, transaction) {
  if (Number(userId) === Number(actorId)) return null;
  return Notification.create({ userId, actorId, type, destinationId }, { transaction });
}
async function removeNotification({ userId, actorId, type, destinationId = null }, transaction) {
  return Notification.destroy({ where: { userId, actorId, type, destinationId }, transaction });
}
async function getUserNotifications(userId, page, limit) {
  return Notification.findAll({ where: { userId }, include: [
    { model: User, as: 'Actor', attributes: ['id', 'username', 'fullName', 'profilePicture'] },
    { model: Destination, attributes: ['id', 'title', 'image'] }
  ], order: [['createdAt', 'DESC'], ['id', 'DESC']], limit, offset: (page - 1) * limit });
}
async function getUnreadCount(userId) { return Notification.count({ where: { userId, isRead: false } }); }
async function markAsRead(id, userId) {
  const notification = await Notification.findByPk(id);
  if (!notification) throw httpError(404, 'Notificação não encontrada.');
  if (Number(notification.userId) !== Number(userId)) throw httpError(403, 'Você não pode alterar esta notificação.');
  if (!notification.isRead) await notification.update({ isRead: true });
  return { id: notification.id, isRead: true, unreadCount: await getUnreadCount(userId) };
}
module.exports = { createNotification, removeNotification, getUserNotifications, getUnreadCount, markAsRead };
