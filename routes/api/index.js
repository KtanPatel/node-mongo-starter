var express = require('express');
const authentication = require('../../middleware/authentication');
const authorization = require('../../middleware/authorization');
var router = express.Router();

const authRoutes = require("./auth");
const userRoutes = require("./users");
const adminRoutes = require("./admin");
const constants = require('../../utils/constants');

// Public Routes 
router.use('/auth', authRoutes);

// Middleware to check token
router.use(authentication);

// Secure Routes
router.use('/user', userRoutes);

// Admin Routes
router.use('/admin', authorization([constants.roles.admin]), adminRoutes);

module.exports = router;