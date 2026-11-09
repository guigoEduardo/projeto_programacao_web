const userService = require('./userService');
const destinationService = require('../destination/destinationService');
const { success } = require('../../middlewares/apiResponse');
const { parsePagination } = require('../../utils/pagination');

exports.register = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  const newUser = await userService.registerUser(username, email, password, fullName);
  return success(res, newUser, 'Conta criada com sucesso! Faça login para continuar.', 201);
};

exports.getPublicProfile = async (req, res) => {
  const user = await userService.getPublicProfile(req.params.username, req.user?.id);
  user.isFollowing = Boolean(req.user && !user.isOwner && await require('../follow/followService').getFollowStatus(req.user.id, user.id));
  return success(res, user);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const result = await userService.loginUser(email, password);
  return success(res, result, 'Login realizado com sucesso.');
};

exports.getMyProfile = async (req, res) => {
  const user = await userService.getUserProfile(req.user.id);
  return success(res, user);
};

exports.logout = async (req, res) => {
  return success(res, null, 'Logout realizado com sucesso.');
};

exports.updateProfile = async (req, res) => {
  const { fullName, bio } = req.body;
  const updatedUser = await userService.updateUserProfile(req.user.id, { fullName, bio }, req.file);
  return success(res, updatedUser, 'Perfil atualizado com sucesso.');
};

exports.getFeed = async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const destinations = await destinationService.getFeedDestinations(page, limit);
  return success(res, destinations);
};
