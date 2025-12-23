const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { createAdmin } = require('../controllers/admin-signup-controller');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Signup Student user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/admin-signup
// @desc    Create admin user (for initial setup only)
// @access  Public
router.post('/admin-signup', createAdmin);          //admin will be created when server starts , this route is optional

module.exports = router;