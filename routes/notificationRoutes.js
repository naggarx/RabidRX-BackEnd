const express = require('express');
const labnotificationController = require('../controllers/labNotificationController');
const clinicnotificationController = require('../controllers/clinicNotificationController');
const router = express.Router();

// Define your routes here
router.get('/getPendingMedicalAnalysis', labnotificationController.getPendingMedicalAnalysis);
router.post('/acceptLab/:id', labnotificationController.acceptMedicalAnalysis);
router.post('/rejectLab/:id', labnotificationController.rejectMedicalAnalysis);

router.get('/getPendingDiagnosis', clinicnotificationController.getPendingDiagnosis);
router.post('/acceptClinic/:id', clinicnotificationController.acceptDiagnosis);
router.post('/rejectClinic/:id', clinicnotificationController.rejectDiagnosis);

module.exports = router;