const router = require('express').Router();
const auth = require('../../middlewares/auth');
const asyncHandler = require('../../middlewares/asyncHandler');
const controller = require('./reportController');
const validator = require('./reportValidator');
router.post('/destinations/:destinationId/report', auth, validator, asyncHandler(controller.create));
module.exports = router;
