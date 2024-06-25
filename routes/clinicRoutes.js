const express = require('express');
const router = express.Router();
const clinicController = require('../controllers/clinicController');
const adminAuthMiddleware = require('../middlewares/adminauthMiddleware');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

// Public routes to get all clinics and get a clinic by ID
router.get('/', clinicController.getClinics);
router.get('/getId', clinicController.getId);
router.get('/:id', clinicController.getClinicById);


// Protected routes to create, update, or delete clinics
router.post('/add', adminAuthMiddleware, authorizeAdmin, clinicController.createClinic);
router.put('/:id', adminAuthMiddleware, authorizeAdmin, clinicController.updateClinic);
router.delete('/:id', adminAuthMiddleware, authorizeAdmin, clinicController.deleteClinic);
router.post('/signin', clinicController.signIn);

router.post('/:clinicId/users/:userId/diagnoses', clinicController.uploadDiagnosis);

module.exports = router;
