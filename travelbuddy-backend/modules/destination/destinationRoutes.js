const express = require('express');
const router = express.Router();
const destinationController = require('./destinationController');
const { createDestinationValidator } = require('./destinationValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const isAuthenticated = require('../../middlewares/auth');
const destinationMulter = require('../../middlewares/destinationMulter');

router.post('/destinations', isAuthenticated, destinationMulter, createDestinationValidator, asyncHandler(destinationController.create));

module.exports = router;