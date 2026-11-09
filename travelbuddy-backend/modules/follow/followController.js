const service = require('./followService');
const { getFollowingDestinations } = require('../destination/destinationService');
const { success } = require('../../middlewares/apiResponse');
const { parsePagination } = require('../../utils/pagination');
const { parsePositiveId } = require('../../utils/parsePositiveId');

function parseUserId(value) {
  return parsePositiveId(value, 'O id do usuário deve ser um inteiro positivo.');
}

exports.toggle = async (req, res) => {
  const result = await service.toggleFollow(req.user.id, parseUserId(req.params.userId));
  return success(res, result, result.isFollowing ? 'Você começou a seguir esta pessoa.' : 'Você deixou de seguir esta pessoa.', result.isFollowing ? 201 : 200);
};
exports.status = async (req, res) => success(res, { isFollowing: await service.getFollowStatus(req.user.id, parseUserId(req.params.userId)) });
exports.followers = async (req, res) => success(res, await service.getFollowers(parseUserId(req.params.userId)));
exports.following = async (req, res) => success(res, await service.getFollowing(parseUserId(req.params.userId)));
exports.feed = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  return success(res, await getFollowingDestinations(req.user.id, page, limit));
};
