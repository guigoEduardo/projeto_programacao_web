const { Op } = require('sequelize');
const Destination = require('../destination/destinationModel');
const User = require('../user/userModel');
const { SEARCH } = require('../../config/constants');
const escapeLike = require('../../utils/escapeLike');
async function searchDestinations(query) { return Destination.findAll({ where: { title: { [Op.like]: `%${escapeLike(query)}%` } }, include: [{ model: User, attributes: ['id', 'username', 'fullName', 'profilePicture'] }], order: [['createdAt', 'DESC'], ['id', 'DESC']], limit: SEARCH.LIMIT }); }
async function searchUsers(query) { const pattern = `%${escapeLike(query)}%`; return User.findAll({ where: { [Op.or]: [{ username: { [Op.like]: pattern } }, { fullName: { [Op.like]: pattern } }] }, attributes: ['id', 'username', 'fullName', 'profilePicture'], order: [['username', 'ASC']], limit: SEARCH.LIMIT }); }
async function globalSearch(query) { const [destinations, users] = await Promise.all([searchDestinations(query), searchUsers(query)]); return { destinations, users }; }
module.exports = { escapeLike, searchDestinations, searchUsers, globalSearch };
