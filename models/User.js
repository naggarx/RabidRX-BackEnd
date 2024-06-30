const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmergencyContactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

const MedicalAnalysisSchema = new mongoose.Schema({
    id:{ type:String ,required: true },
    type:{type:String},
    testName:String,
    pdfPath: { type: String, required: true }, // Field to store the path or URL of the uploaded PDF
    date: { type: Date, default: Date.now },
});

const DiagnosisSchema = new mongoose.Schema({
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    pdfPath: { type: String, required: true }, // Field to store the path or URL of the uploaded PDF
    date: { type: Date, default: Date.now },
  });

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    token : String
    ,
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    bloodType: {
        type: String,
        required: true
    },
    //profileImage: { type: String },
    personalMedicalHistory: {
        anemia: { type: Boolean, default: false },
        arthritis: { type: Boolean, default: false },
        asthma: { type: Boolean, default: false },
        cancer: { type: Boolean, default: false },
        chronicObstructive: { type: Boolean, default: false },
        heartDisease: { type: Boolean, default: false },
        clottingDisorder: { type: Boolean, default: false },
        congestiveHeartFailure: { type: Boolean, default: false },
        crohnsDisease: { type: Boolean, default: false },
        depression: { type: Boolean, default: false },
        diabetes: { type: Boolean, default: false },
        emphysema: { type: Boolean, default: false },
        endocrineProblems: { type: Boolean, default: false },
        GERD: { type: Boolean, default: false },
        glaucoma: { type: Boolean, default: false },
        hepatitis: { type: Boolean, default: false },
        HIV_AIDS: { type: Boolean, default: false },
        hypertension: { type: Boolean, default: false },
        kidneyDisease: { type: Boolean, default: false },
        myocardialInfarction: { type: Boolean, default: false },
        pepticUlcerDisease: { type: Boolean, default: false },
        seizures: { type: Boolean, default: false },
        stroke: { type: Boolean, default: false },
        ulcerativeColitis: { type: Boolean, default: false }
    },
    personalSurgicalHistory: {
        adrenalGlandSurgery: { type: Boolean, default: false },
        arterySurgery: { type: Boolean, default: false },
        prostateSurgery: { type: Boolean, default: false },
        lungSurgery: { type: Boolean, default: false },
        spineSurgery: { type: Boolean, default: false },
        colonSurgery: { type: Boolean, default: false },
        neckSurgery: { type: Boolean, default: false },
        bladderSurgery: { type: Boolean, default: false },
        smallIntestineSurgery: { type: Boolean, default: false },
        uterusSurgery: { type: Boolean, default: false },
        kidneySurgery: { type: Boolean, default: false },
        thyroidSurgery: { type: Boolean, default: false },
        largeIntestineSurgery: { type: Boolean, default: false },
        breastSurgery: { type: Boolean, default: false },
        cesareanSection: { type: Boolean, default: false },
        appendectomy: { type: Boolean, default: false },
        esophagusSurgery: { type: Boolean, default: false },
        gastricBypassSurgery: { type: Boolean, default: false },
        hemorrhoidSurgery: { type: Boolean, default: false },
        stomachSurgery: { type: Boolean, default: false }
    },
    personalAllergiesHistory: {
        foodAllergies: { type: Boolean, default: false },
        drugAllergies: { type: Boolean, default: false },
        dustAllergies: { type: Boolean, default: false },
        petAllergies: { type: Boolean, default: false },
        temperatureChanges: { type: Boolean, default: false },
        seasonalAllergies: { type: Boolean, default: false },
        pollutionAllergy: { type: Boolean, default: false },
        moldAllergies: { type: Boolean, default: false }
    },
    familyMedicalHistory: {
        cancer: { type: Boolean, default: false },
        anemia: { type: Boolean, default: false },
        highBloodPressure: { type: Boolean, default: false },
        diabetes: { type: Boolean, default: false },
        anesthesiaReaction: { type: Boolean, default: false },
        bloodClots: { type: Boolean, default: false },
        bleedingProblems: { type: Boolean, default: false },
        heartDisease: { type: Boolean, default: false },
        hepatitis: { type: Boolean, default: false },
        stroke: { type: Boolean, default: false },
        kidneyDisease: { type: Boolean, default: false },
        endocrineProblems: { type: Boolean, default: false }
    },
    emergencyContacts: [EmergencyContactSchema],
    medicalAnalysis:[MedicalAnalysisSchema],
    pendingMedicalAnalysis:[MedicalAnalysisSchema],
    diagnosis:[DiagnosisSchema],
    pendingDiagnosis:[DiagnosisSchema],
    numPendingNotifications:{type:Number,default:0}

});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
