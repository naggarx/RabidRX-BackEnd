const mongoose = require('mongoose');

const MedicalAnalysisSchema = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testName:String,
  pdfPath: { type: String, required: true }, // Field to store the path or URL of the uploaded PDF
  date: { type: Date, default: Date.now },
});

const MedicalAnalysis = mongoose.model('LabMedicalAnalysis', MedicalAnalysisSchema);

module.exports = MedicalAnalysis;