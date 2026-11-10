const { body, validationResult } = require('express-validator');
const { VALIDATION } = require('../../config/constants');
const createCollectionValidator = [
  body('title').trim().notEmpty().withMessage('O título é obrigatório.').isLength({ min: VALIDATION.COLLECTION_TITLE_MIN, max: VALIDATION.COLLECTION_TITLE_MAX }).withMessage(`O título deve ter entre ${VALIDATION.COLLECTION_TITLE_MIN} e ${VALIDATION.COLLECTION_TITLE_MAX} caracteres.`),
  body('description').optional({ checkFalsy: true }).isLength({ max: VALIDATION.COLLECTION_DESCRIPTION_MAX }).withMessage(`A descrição deve ter no máximo ${VALIDATION.COLLECTION_DESCRIPTION_MAX} caracteres.`),
  body('isPublic').optional().isBoolean({ strict: true }).withMessage('O campo público deve ser verdadeiro ou falso.'),
  (req, res, next) => { const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Dados inválidos.', errors: errors.array() }); next(); }
];
module.exports = { createCollectionValidator };
