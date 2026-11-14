const service = require('./reportService');
const { success } = require('../../middlewares/apiResponse');
const { parseId } = require('../../utils/parseId');
exports.create = async (req, res) => {
  const report = await service.createReport(req.user.id, parseId(req.params.destinationId, 'destino'), req.body.reason);
  return success(res, { id: report.id, destinationId: report.destinationId, reason: report.reason }, 'Denúncia registrada.', 201);
};
