const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');

exports.createDestinationValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('O título é obrigatório.')
    .isLength({ max: VALIDATION.TITLE_MAX }).withMessage(`Título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
  body('description')
    .optional()
    .isLength({ max: VALIDATION.DESCRIPTION_MAX }).withMessage(`Descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`),
  body('category')
    .trim()
    .notEmpty().withMessage('A categoria é obrigatória.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
    }
    next();
  }
];