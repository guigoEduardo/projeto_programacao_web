const service = require('./commentService');
const { success } = require('../../middlewares/apiResponse');

exports.list = async (req, res) => success(res, await service.listComments(Number(req.params.destinationId)));
exports.create = async (req, res) => success(res, await service.createComment(req.user.id, Number(req.params.destinationId), req.body.content), 'Comentário publicado.', 201);
