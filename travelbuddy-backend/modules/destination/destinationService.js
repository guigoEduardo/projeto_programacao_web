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

module.exports = { createDestination };