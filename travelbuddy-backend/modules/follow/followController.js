const service = require('./followService');
const { getFollowingDestinations } = require('../destination/destinationService');
const { success } = require('../../middlewares/apiResponse');
const { parsePagination } = require('../../utils/pagination');
const { parseId } = require('../../utils/parseId');

exports.toggle = async (req, res) => {
  const result = await service.toggleFollow(req.user.id, parseId(req.params.userId, 'usu\u00e1rio'));
  return success(res, result, result.isFollowing ? 'Você começou a seguir esta pessoa.' : 'Você deixou de seguir esta pessoa.', result.isFollowing ? 201 : 200);
};
exports.status = async (req, res) => success(res, { isFollowing: await service.getFollowStatus(req.user.id, parseId(req.params.userId, 'usu\u00e1rio')) });
exports.followers = async (req, res) => success(res, await service.getFollowers(parseId(req.params.userId, 'usu\u00e1rio')));
exports.following = async (req, res) => success(res, await service.getFollowing(parseId(req.params.userId, 'usu\u00e1rio')));
exports.feed = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  return success(res, await getFollowingDestinations(req.user.id, page, limit));
};
