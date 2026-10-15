const userService = require('./userService');
const destinationService = require('../destination/destinationService');
const { success } = require('../../middlewares/apiResponse');

exports.register = async (req, res) => {
  const { username, email, password, fullName } = req.body;
  const newUser = await userService.registerUser(username, email, password, fullName);
  return success(res, newUser, 'Conta criada com sucesso! Faça login para continuar.', 201);
};

exports.getPublicProfile = async (req, res) => {
  const user = await userService.getPublicProfile(req.params.username, req.user?.id);
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
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
  const destinations = await destinationService.getFeedDestinations(page, limit);
  return success(res, destinations);
};
