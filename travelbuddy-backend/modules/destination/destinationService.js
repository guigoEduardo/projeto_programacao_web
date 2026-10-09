const Destination = require('./destinationModel');
const User = require('../user/userModel');

async function createDestination(userId, { title, description, category }, file) {
  if (!file) {
    const error = new Error('A imagem do destino é obrigatória.');
    error.status = 422;
    throw error;
  }

  const destination = await Destination.create({
    userId,
    title,
    description,
    category,
    image: file.filename
  });

  await User.increment('destinationsCount', { where: { id: userId } });

  return destination;
}

async function getDestinationDetails(id, viewerId) {
  const destination = await Destination.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'fullName', 'profilePicture']
      }
    ]
  });

  if (!destination) {
    const error = new Error('Destino não encontrado.');
    error.status = 404;
    throw error;
  }

  await destination.increment('viewsCount');
  await destination.reload();

  const isOwner = viewerId ? destination.userId === viewerId : false;

  return { destination, isOwner };
}

async function getFeedDestinations(page, limit) {
  const offset = (page - 1) * limit;

  return Destination.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'fullName', 'profilePicture']
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
}

module.exports = { createDestination, getDestinationDetails, getFeedDestinations };