const { verifyToken } = require('../config/jwt');

function isAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Token não fornecido.');
    error.status = 401;
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    const error = new Error('Token inválido ou expirado.');
    error.status = 401;
    next(error);
  }
}

module.exports = isAuthenticated;