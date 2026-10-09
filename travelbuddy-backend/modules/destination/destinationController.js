const destinationService = require('./destinationService');
const { success } = require('../../middlewares/apiResponse');

exports.create = async (req, res) => {
  const { title, description, category } = req.body;
  const destination = await destinationService.createDestination(req.user.id, { title, description, category }, req.file);
  return success(res, destination, 'Destino criado com sucesso!', 201);
};

exports.getDetails = async (req, res) => {
  const viewerId = req.user ? req.user.id : null;
  const { destination, isOwner } = await destinationService.getDestinationDetails(req.params.id, viewerId);
  return success(res, { destination, isOwner }, 'Destino carregado com sucesso!');
};