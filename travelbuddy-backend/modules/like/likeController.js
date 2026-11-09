const service = require('./likeService');
const { success } = require('../../middlewares/apiResponse');
const { parsePositiveId } = require('../../utils/parsePositiveId');

exports.toggle = async (req, res) => {
  const result = await service.toggleLike(req.user.id, parsePositiveId(req.params.destinationId));
  return success(res, result, 'Curtida atualizada.', result.liked ? 201 : 200);
};
exports.status = async (req, res) => success(res, await service.likeStatus(req.user?.id, parsePositiveId(req.params.destinationId)));
exports.list = async (req, res) => success(res, await service.getLikedDestinations(req.user.id));
