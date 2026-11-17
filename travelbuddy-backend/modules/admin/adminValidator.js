const { query, body } = require('express-validator');
const { ADMIN } = require('../../config/constants');
exports.reportsFilterValidator=[query('status').optional().isIn(ADMIN.REPORT_FILTERS).withMessage('Filtro de denúncias inválido.')];
exports.blockValidator=[body('isBlocked').exists().withMessage('O status de bloqueio é obrigatório.').bail().custom(value=>typeof value==='boolean').withMessage('O status de bloqueio deve ser booleano.')];
