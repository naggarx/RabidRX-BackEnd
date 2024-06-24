const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pdfPath: { type: String, required: true }, // Field to store the path or URL of the uploaded PDF
  date: { type: Date, default: Date.now },
});


const Diagnosis = mongoose.model('Diagnosis', DiagnosisSchema);

module.exports = Diagnosis;
