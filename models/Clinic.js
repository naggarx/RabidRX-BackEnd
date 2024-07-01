// models/clinic.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  token:String,
  numOfEvaluation:{
    type: Number,
    default: 0
  },
  sumOfEvaluation: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    default: 0
  }
});

clinicSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});

clinicSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

clinicSchema.methods.calculateRate = function () {
  if (this.numOfEvaluation === 0) {
    return 0;
  }
  return this.sumOfEvaluation / this.numOfEvaluation;
};


const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
