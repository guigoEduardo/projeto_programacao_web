const { body, validationResult } = require('express-validator');
const { REPORT } = require('../../config/constants');
module.exports = [body('reason').isIn(REPORT.REASONS).withMessage('Escolha um motivo válido para a denúncia.'), (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
  next();
}];
