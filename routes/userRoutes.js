const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const router = express.Router();

// Define your routes here
router.post('/register', UserController.createUser);
router.post('/signin', AuthController.signIn);

module.exports = router;