const service = require('./followService');
const { getFollowingDestinations } = require('../destination/destinationService');
const { success } = require('../../middlewares/apiResponse');

function parseUserId(value) {
  const id = Number(value);
  if (!/^\d+$/.test(value) || !Number.isSafeInteger(id) || id <= 0) {
    throw Object.assign(new Error('O id do usuário deve ser um inteiro positivo.'), { status: 400 });
  }
  return id;
}

exports.toggle = async (req, res) => {
  const result = await service.toggleFollow(req.user.id, parseUserId(req.params.userId));
  return success(res, result, result.isFollowing ? 'Você começou a seguir esta pessoa.' : 'Você deixou de seguir esta pessoa.', result.isFollowing ? 201 : 200);
};
exports.status = async (req, res) => success(res, { isFollowing: await service.getFollowStatus(req.user.id, parseUserId(req.params.userId)) });
exports.followers = async (req, res) => success(res, await service.getFollowers(parseUserId(req.params.userId)));
exports.following = async (req, res) => success(res, await service.getFollowing(parseUserId(req.params.userId)));
exports.feed = async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  return success(res, await getFollowingDestinations(req.user.id, page, limit));
};
