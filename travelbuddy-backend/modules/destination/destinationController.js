const destinationService = require('./destinationService');
const { success } = require('../../middlewares/apiResponse');
const { parsePositiveId } = require('../../utils/parsePositiveId');

exports.create = async (req, res) => {
  const { title, description, category } = req.body;
  const destination = await destinationService.createDestination(req.user.id, { title, description, category }, req.file);
  return success(res, destination, 'Destino criado com sucesso!', 201);
};

exports.getDetails = async (req, res) => {
  const viewerId = req.user ? req.user.id : null;
  const { destination, isOwner, isLiked } = await destinationService.getDestinationDetails(parsePositiveId(req.params.id), viewerId);
  return success(res, { destination, isOwner, isLiked }, 'Destino carregado com sucesso!');
};

exports.getMine = async (req, res) => success(res, await destinationService.getMyDestinations(req.user.id));
exports.getForEdit = async (req, res) => success(res, await destinationService.getDestinationForEdit(parsePositiveId(req.params.id), req.user.id));
exports.authorizeUpdate = async (req, res, next) => {
  await destinationService.getDestinationForEdit(parsePositiveId(req.params.id), req.user.id);
  next();
};
exports.update = async (req, res) => {
  const { title, description, category } = req.body;
  const destination = await destinationService.updateDestination(parsePositiveId(req.params.id), req.user.id, { title, description, category }, req.file);
  return success(res, destination, 'Destino atualizado com sucesso!');
};
exports.remove = async (req, res) => {
  await destinationService.deleteDestination(parsePositiveId(req.params.id), req.user.id);
  return success(res, null, 'Destino excluído com sucesso!');
};
