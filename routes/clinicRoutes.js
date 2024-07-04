const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const adminAuthMiddleware = require('../middlewares/adminauthMiddleware');
const authorizeAdmin = require('../middlewares/authorizeAdmin');
const upload = require('../middlewares/multer');
// Public routes to get all clinics and get a clinic by ID
router.get('/', clinicController.getClinics);
router.get('/getClinicByToken', clinicController.getClinicByToken);  
router.get('/:id', clinicController.getClinicById);


// Protected routes to create, update, or delete clinics
router.post('/add', adminAuthMiddleware, authorizeAdmin, clinicController.createClinic);
router.put('/logout', clinicController.logout);
router.put('/:id', adminAuthMiddleware, authorizeAdmin, clinicController.updateClinic);
router.delete('/:id', adminAuthMiddleware, authorizeAdmin, clinicController.deleteClinic);
router.post('/signin', clinicController.signIn);

router.post('/:clinicId/users/:userId/diagnoses',upload.single("pdf"), clinicController.uploadDiagnosis);
router.post('/:clinicId/users/:userId/medicalAnalysis',upload.single("pdf"),clinicController.uploadMedicalAnalysis);

module.exports = router;
