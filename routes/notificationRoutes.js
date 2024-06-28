const express = require('express');
const medicalAnalysisNotificationController = require('../controllers/medicalAnalysisNotificationController');
const diagnosisNotificationController = require('../controllers/diagnosisNotificationController');
const router = express.Router();

// Define your routes here
router.get('/getPendingMedicalAnalysis', medicalAnalysisNotificationController.getPendingMedicalAnalysis);
router.post('/acceptMedicalAnalysis/:id', medicalAnalysisNotificationController.acceptMedicalAnalysis);
router.post('/rejectMedicalAnalysis/:id', medicalAnalysisNotificationController.rejectMedicalAnalysis);

router.get('/getPendingDiagnosis', diagnosisNotificationController.getPendingDiagnosis);
router.post('/acceptDiagnosis/:id', diagnosisNotificationController.acceptDiagnosis);
router.post('/rejectDiagnosis/:id', diagnosisNotificationController.rejectDiagnosis);

module.exports = router;