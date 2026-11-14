const Report = require('./reportModel');
const Destination = require('../destination/destinationModel');
function httpError(status, message) { return Object.assign(new Error(message), { status }); }
async function createReport(userId, destinationId, reason) {
  const destination = await Destination.findByPk(destinationId);
  if (!destination) throw httpError(404, 'Destino não encontrado.');
  if (Number(destination.userId) === Number(userId)) throw httpError(400, 'Você não pode denunciar o seu próprio destino.');
  const [report, created] = await Report.findOrCreate({ where: { userId, destinationId }, defaults: { userId, destinationId, reason } });
  if (!created) throw httpError(409, 'Você já denunciou este destino.');
  return report;
}
module.exports = { createReport };
