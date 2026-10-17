const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

module.exports = [
  body('content').trim().notEmpty().withMessage('O comentário é obrigatório.').isLength({ max: VALIDATION.COMMENT_MAX }).withMessage(`O comentário deve ter no máximo ${VALIDATION.COMMENT_MAX} caracteres.`),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
    next();
  }
];
