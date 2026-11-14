const service = require('./notificationService');
const { success } = require('../../middlewares/apiResponse');
const { parseId } = require('../../utils/parseId');
const { parsePagination } = require('../../utils/pagination');
exports.list = async (req, res) => { const { page, limit } = parsePagination(req.query); return success(res, await service.getUserNotifications(req.user.id, page, limit)); };
exports.unreadCount = async (req, res) => success(res, { unreadCount: await service.getUnreadCount(req.user.id) });
exports.read = async (req, res) => success(res, await service.markAsRead(parseId(req.params.id, 'notificação'), req.user.id));
