const User = require('../modules/user/userModel');
const { verifyToken } = require('../config/jwt');
async function isAuthenticated(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return next(Object.assign(new Error('Token não fornecido.'), { status: 401 }));
  let decoded;
  try { decoded = verifyToken(header.split(' ')[1]); }
  catch (_) { return next(Object.assign(new Error('Token inválido ou expirado.'), { status: 401 })); }
  try {
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'username', 'isAdmin', 'isBlocked'] });
    if (!user) return next(Object.assign(new Error('Token inválido ou expirado.'), { status: 401 }));
    if (user.isBlocked) return next(Object.assign(new Error('Sua conta foi bloqueada. Entre em contato com a administração.'), { status: 401 }));
    req.user = { id: user.id, username: user.username, isAdmin: user.isAdmin };
    return next();
  } catch (error) { return next(error); }
}
function isAdmin(req, res, next) {
  if (!req.user?.isAdmin) return next(Object.assign(new Error('Acesso restrito a administradores.'), { status: 403 }));
  return next();
}
module.exports = isAuthenticated;
module.exports.isAdmin = isAdmin;
