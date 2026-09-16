const destinationService = require('./destinationService');
const { success } = require('../../middlewares/apiResponse');

exports.create = async (req, res) => {
  const { title, description, category } = req.body;
  const destination = await destinationService.createDestination(req.user.id, { title, description, category }, req.file);
  return success(res, destination, 'Destino criado com sucesso!', 201);
};