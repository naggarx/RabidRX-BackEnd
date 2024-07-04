const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');
const adminAuthMiddleware = require('../middlewares/adminauthMiddleware');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const upload = require('../middlewares/multer');

// Public routes to get all clinics and get a clinic by ID
router.get('/', labController.getLabs);
router.get('/getLabByToken', labController.getLabByToken);  
router.get('/:id', labController.getLabById);

// Protected routes to create, update, or delete clinics
router.post('/add', adminAuthMiddleware, authorizeAdmin, labController.createLab);
router.put('/logout', labController.logout);
router.put('/:id', adminAuthMiddleware, authorizeAdmin, labController.updateLab);
router.delete('/:id', adminAuthMiddleware, authorizeAdmin, labController.deleteLab);
router.post('/:labId/users/:userId/medicalAnalysis',upload.single("pdf"),labController.uploadMedicalAnalysis);
router.post('/signin', labController.signIn);

module.exports = router;