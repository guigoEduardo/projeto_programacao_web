const Destination = require('./destinationModel');
const User = require('../user/userModel');
const fs = require('fs/promises');
const path = require('path');
const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'destinations');

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function findOwnedDestination(id, userId) {
  const destination = await Destination.findByPk(id);
  if (!destination) throw httpError(404, 'Destino não encontrado.');
  if (destination.userId !== userId) throw httpError(403, 'Você não tem permissão para alterar este destino.');
  return destination;
}

async function removeFile(filename) {
  if (!filename) return;
  try { await fs.unlink(path.join(uploadDir, filename)); }
  catch (error) { if (error.code !== 'ENOENT') console.error('Erro ao remover arquivo:', error.message); }
}

async function createDestination(userId, { title, description, category }, file) {
  if (!file) {
    const error = new Error('A imagem do destino é obrigatória.');
    error.status = 422;
    throw error;
  }

  const sequelize = require('../../config/database');
  const destination = await sequelize.transaction(async (transaction) => {
    const created = await Destination.create({ userId, title, description, category, image: file.filename }, { transaction });
    await User.increment('destinationsCount', { where: { id: userId }, transaction });
    return created;
  });

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

async function getMyDestinations(userId) {
  return Destination.findAll({ where: { userId }, include: [{ model: User, attributes: ['id', 'username', 'fullName', 'profilePicture'] }], order: [['createdAt', 'DESC']] });
}

async function getDestinationForEdit(id, userId) {
  return findOwnedDestination(id, userId);
}

async function updateDestination(id, userId, { title, description, category }, file) {
  const destination = await findOwnedDestination(id, userId);
  const oldImage = destination.image;
  destination.title = title;
  destination.description = description;
  destination.category = category;
  if (file) destination.image = file.filename;
  await destination.save();
  if (file && oldImage !== destination.image) await removeFile(oldImage);
  return destination;
}

async function deleteDestination(id, userId) {
  const destination = await findOwnedDestination(id, userId);
  const sequelize = require('../../config/database');
  await sequelize.transaction(async (transaction) => {
    await destination.destroy({ transaction });
    await User.decrement('destinationsCount', { by: 1, where: { id: userId, destinationsCount: { [require('sequelize').Op.gt]: 0 } }, transaction });
  });
  await removeFile(destination.image);
  return destination.id;
}

module.exports = { createDestination, getDestinationDetails, getFeedDestinations, getMyDestinations, getDestinationForEdit, updateDestination, deleteDestination, removeFile };
