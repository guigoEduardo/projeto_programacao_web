const router = require('express').Router();
const controller = require('./followController');
const auth = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');

router.post('/users/:userId/toggle-follow', auth, asyncHandler(controller.toggle));
router.get('/users/:userId/follow-status', auth, asyncHandler(controller.status));
router.get('/users/:userId/followers', asyncHandler(controller.followers));
router.get('/users/:userId/following', asyncHandler(controller.following));
router.get('/following-destinations', auth, asyncHandler(controller.feed));
module.exports = router;
