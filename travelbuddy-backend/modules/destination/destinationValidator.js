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
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file?.path) {
        try { await require('fs/promises').unlink(req.file.path); }
        catch (cleanupError) { if (cleanupError.code !== 'ENOENT') console.error('Erro ao limpar upload inválido:', cleanupError.message); }
      }
      return res.status(422).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
    }
    next();
  }
];

exports.updateDestinationValidator = [
  body('title').trim().notEmpty().withMessage('O título é obrigatório.').isLength({ max: VALIDATION.TITLE_MAX }).withMessage(`Título deve ter no máximo ${VALIDATION.TITLE_MAX} caracteres.`),
  body('description').optional().isLength({ max: VALIDATION.DESCRIPTION_MAX }).withMessage(`Descrição deve ter no máximo ${VALIDATION.DESCRIPTION_MAX} caracteres.`),
  body('category').trim().notEmpty().withMessage('A categoria é obrigatória.'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file?.path) {
        try { await require('fs/promises').unlink(req.file.path); }
        catch (cleanupError) { if (cleanupError.code !== 'ENOENT') console.error('Erro ao limpar upload inválido:', cleanupError.message); }
      }
      return res.status(400).json({ success: false, message: 'Dados inválidos.', errors: errors.array() });
    }
    next();
  }
];
