const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Define your routes here
router.post('/register', UserController.createUser);
router.put('/updatePassword', UserController.updatePassword);
router.put('/updateProfile', UserController.updateProfile);
router.get('/logout', UserController.logout);
router.post('/signin', AuthController.signIn);
router.get('/profile', authMiddleware, UserController.viewProfile);
router.post('/predict', UserController.predictDiabetes);
module.exports = router;