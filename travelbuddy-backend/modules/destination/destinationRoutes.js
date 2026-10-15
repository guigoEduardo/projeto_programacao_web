const express = require('express');
const router = express.Router();
const destinationController = require('./destinationController');
const { createDestinationValidator, updateDestinationValidator } = require('./destinationValidator');
const asyncHandler = require('../../middlewares/asyncHandler');
const isAuthenticated = require('../../middlewares/auth');
const optionalAuth = require('../../middlewares/optionalAuth');
const destinationMulter = require('../../middlewares/destinationMulter');

router.post('/destinations', isAuthenticated, destinationMulter, createDestinationValidator, asyncHandler(destinationController.create));
router.get('/my-destinations', isAuthenticated, asyncHandler(destinationController.getMine));
router.get('/destinations/:id/edit', isAuthenticated, asyncHandler(destinationController.getForEdit));
router.put('/destinations/:id', isAuthenticated, asyncHandler(destinationController.authorizeUpdate), destinationMulter, updateDestinationValidator, asyncHandler(destinationController.update));
router.delete('/destinations/:id', isAuthenticated, asyncHandler(destinationController.remove));
router.get('/destinations/:id', optionalAuth, asyncHandler(destinationController.getDetails));

module.exports = router;
