const { Op } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('../user/userModel');
const Follow = require('./followModel');

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

async function requireUser(id, options = {}) {
  const user = await User.findByPk(id, options);
  if (!user) throw httpError(404, 'Usuário não encontrado.');
  return user;
}

async function toggleFollow(followerId, followingId) {
  if (followerId === followingId) throw httpError(400, 'Você não pode seguir a si mesmo.');
  const target = await requireUser(followingId);
  const isFollowing = await sequelize.transaction(async (transaction) => {
    // Lock both users in the same order, including when two users follow each other.
    await User.findAll({
      where: { id: { [Op.in]: [followerId, followingId] } },
      order: [['id', 'ASC']], transaction, lock: transaction.LOCK.UPDATE
    });
    const [follow, created] = await Follow.findOrCreate({ where: { followerId, followingId }, transaction });
    if (!created) await follow.destroy({ transaction });
    const delta = created ? 1 : -1;
    await User.increment('followersCount', { by: delta, where: { id: followingId }, transaction });
    await User.increment('followingCount', { by: delta, where: { id: followerId }, transaction });
    return created;
  });
  await target.reload();
  return { isFollowing, followersCount: target.followersCount };
}

async function getFollowStatus(followerId, followingId) {
  await requireUser(followingId, { attributes: ['id'] });
  if (followerId === followingId) return false;
  return Boolean(await Follow.findOne({ where: { followerId, followingId }, attributes: ['id'] }));
}

const publicAttributes = ['id', 'username', 'fullName', 'profilePicture', 'bio', 'followersCount', 'followingCount'];
async function getFollowers(userId) {
  await requireUser(userId, { attributes: ['id'] });
  const rows = await Follow.findAll({
    where: { followingId: userId },
    include: [{ model: User, as: 'Follower', attributes: publicAttributes }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });
  return rows.map(row => row.Follower);
}

async function getFollowing(userId) {
  await requireUser(userId, { attributes: ['id'] });
  const rows = await Follow.findAll({
    where: { followerId: userId },
    include: [{ model: User, as: 'Following', attributes: publicAttributes }],
    order: [['createdAt', 'DESC'], ['id', 'DESC']]
  });
  return rows.map(row => row.Following);
}

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing };
