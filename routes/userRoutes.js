const express = require('express');
const UserController = require('../controllers/userController');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');
const router = express.Router();

// Define your routes here
router.post('/register', upload.single('profileImage'), UserController.createUser);
router.put('/updatePassword', UserController.updatePassword);
router.put('/updateProfile', UserController.updateProfile);
router.put('/logout', UserController.logout);
router.post('/signin', AuthController.signIn);
router.get('/getId', UserController.getId);
router.get('/numOfNotification', UserController.getNumOfNotification);
router.get('/medicalAnalysis', UserController.getMedicalAnalysis);
router.get('/diagnosis', UserController.getDiagnosis);
router.get('/profile', authMiddleware, UserController.viewProfile);
router.post('/predict', UserController.predictDiabetes);
module.exports = router;