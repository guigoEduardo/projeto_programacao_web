const Collection = require('./collectionModel');
const CollectionDestination = require('./collectionDestinationModel');
const Destination = require('../destination/destinationModel');
const User = require('../user/userModel');
const sequelize = require('../../config/database');
const { Op } = require('sequelize');
function error(status, message) { const e = new Error(message); e.status = status; return e; }
async function findOwned(id, userId) {
  const c = await Collection.findByPk(id);
  if (!c) throw error(404, 'Coleção não encontrada.');
  if (Number(c.userId) !== Number(userId)) throw error(403, 'Você não tem permissão para alterar esta coleção.');
  return c;
}
async function getMine(userId) { return Collection.findAll({ where: { userId }, order: [['createdAt','DESC'],['id','DESC']] }); }
async function create(userId, data) { return Collection.create({ userId, title: data.title.trim(), description: data.description?.trim() || null, isPublic: data.isPublic === true }); }
async function getById(id, viewerId) {
  const c = await Collection.findByPk(id, { include: [{ model: User, attributes: ['id','username','fullName','profilePicture'] }] });
  if (!c) throw error(404, 'Coleção não encontrada.');
  const isOwner = viewerId !== null && viewerId !== undefined && Number(c.userId) === Number(viewerId);
  if (!c.isPublic && !isOwner) throw error(403, 'Esta coleção é privada.');
  const links = await CollectionDestination.findAll({ where: { collectionId: c.id }, include: [{ model: Destination, include: [{ model: User, attributes: ['id','username','fullName','profilePicture'] }] }], order: [['createdAt','DESC'],['id','DESC']] });
  return { collection: c, items: links.map(x => x.Destination).filter(Boolean), isOwner };
}
async function add(collectionId, userId, destinationId) {
  const c = await findOwned(collectionId, userId);
  const d = await Destination.findByPk(destinationId);
  if (!d) throw error(404, 'Destino não encontrado.');
  let added = false;
  await sequelize.transaction(async t => {
    const [, created] = await CollectionDestination.findOrCreate({ where: { collectionId: c.id, destinationId: d.id }, defaults: { collectionId: c.id, destinationId: d.id }, transaction: t });
    added = created;
    if (added) await c.increment('destinationsCount', { transaction: t });
  });
  await c.reload(); return { added, destinationsCount: c.destinationsCount };
}
async function remove(collectionId, userId, destinationId) {
  const c = await findOwned(collectionId, userId);
  let deleted = 0;
  await sequelize.transaction(async t => {
    deleted = await CollectionDestination.destroy({ where: { collectionId: c.id, destinationId }, transaction: t });
    if (deleted) await c.decrement('destinationsCount', { by: 1, transaction: t });
  });
  if (!deleted) throw error(404, 'Este destino não está na coleção.');
  await c.reload(); return { destinationsCount: c.destinationsCount };
}
async function destroy(id, userId) {
  const c = await findOwned(id, userId);
  await sequelize.transaction(async t => { await CollectionDestination.destroy({ where: { collectionId: c.id }, transaction: t }); await c.destroy({ transaction: t }); });
}
async function getStatus(userId, destinationId) {
  const d = await Destination.findByPk(destinationId); if (!d) throw error(404, 'Destino não encontrado.');
  const collections = await getMine(userId);
  const links = await CollectionDestination.findAll({ where: { destinationId, collectionId: { [Op.in]: collections.map(c => c.id) } }, attributes: ['collectionId'] });
  const included = new Set(links.map(x => Number(x.collectionId)));
  return collections.map(c => ({ id: c.id, title: c.title, isPublic: c.isPublic, destinationsCount: c.destinationsCount, hasDestination: included.has(Number(c.id)) }));
}
module.exports = { findOwned, getMine, create, getById, add, remove, destroy, getStatus };
