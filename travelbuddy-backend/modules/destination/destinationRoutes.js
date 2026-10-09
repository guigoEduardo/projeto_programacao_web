const express = require('express');
const router = express.Router();
const destinationController = require('./destinationController');
const { createDestinationValidator } = require('./destinationValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const isAuthenticated = require('../../middlewares/auth');
const optionalAuth = require('../../middlewares/optionalAuth');
const destinationMulter = require('../../middlewares/destinationMulter');

router.post('/destinations', isAuthenticated, destinationMulter, createDestinationValidator, asyncHandler(destinationController.create));
router.get('/destinations/:id', optionalAuth, asyncHandler(destinationController.getDetails));

module.exports = router;