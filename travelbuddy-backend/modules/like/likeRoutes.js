const router = require('express').Router();
const controller = require('./likeController');
const asyncHandler = require('../../middlewares/asyncHandler');
const auth = require('../../middlewares/auth');
const optionalAuth = require('../../middlewares/optionalAuth');

router.get('/liked-destinations', auth, asyncHandler(controller.list));
router.post('/destinations/:destinationId/toggle-like', auth, asyncHandler(controller.toggle));
router.get('/destinations/:destinationId/like-status', optionalAuth, asyncHandler(controller.status));
module.exports = router;
