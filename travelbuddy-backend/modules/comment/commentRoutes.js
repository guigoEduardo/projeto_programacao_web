const router = require('express').Router();
const controller = require('./commentController');
const validator = require('./commentValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const auth = require('../../middlewares/auth');

router.get('/destinations/:destinationId/comments', asyncHandler(controller.list));
router.post('/destinations/:destinationId/comments', auth, validator, asyncHandler(controller.create));
module.exports = router;
