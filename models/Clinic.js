// models/clinic.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String
  }
});

const socialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  }
});

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  branches: [branchSchema],
  contactNumbers: {
    type: [String],
    required: true
  },
  socialMedia: [socialMediaSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
