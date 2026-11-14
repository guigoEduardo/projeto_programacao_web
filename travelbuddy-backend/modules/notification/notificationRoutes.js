const router = require('express').Router();
const auth = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const controller = require('./notificationController');
router.get('/notifications', auth, asyncHandler(controller.list));
router.get('/notifications/unread-count', auth, asyncHandler(controller.unreadCount));
router.patch('/notifications/:id/read', auth, asyncHandler(controller.read));
module.exports = router;
