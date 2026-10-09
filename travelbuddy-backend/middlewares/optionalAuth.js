const { verifyToken } = require('../config/jwt');

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.user = verifyToken(authHeader.split(' ')[1]);
    } catch (err) {
      // token inválido ou expirado: segue como visitante
    }
  }

  next();
}

module.exports = optionalAuth;