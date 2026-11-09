const service = require('./commentService');
const { success } = require('../../middlewares/apiResponse');
const { parsePositiveId } = require('../../utils/parsePositiveId');

exports.list = async (req, res) => success(res, await service.listComments(parsePositiveId(req.params.destinationId)));
exports.create = async (req, res) => success(res, await service.createComment(req.user.id, parsePositiveId(req.params.destinationId), req.body.content), 'Comentário publicado.', 201);
