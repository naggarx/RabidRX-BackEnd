const Lab = require('../models/Lab');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const MedicalAnalysis = require('../models/LabMedicalAnalysis');
const jwtSecret = process.env.JWT_SECRET



// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
  }
});
const upload = multer({ storage: storage });




exports.createLab = async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).send(lab);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getLabs = async (req, res) => {
  try {
    const Labs = await Lab.find();
    res.status(200).send(Labs);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getLabById = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).send();
    }
    res.status(200).send(lab);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lab) {
      return res.status(404).send();
    }
    res.status(200).send(lab);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
      return res.status(404).send();
    }
    res.status(200).send(lab);
  } catch (error) {
    res.status(500).send(error);
  }
};


exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const lab = await Lab.findOne({ username });
    if (!lab) {
      return res.status(404).send({ error: 'Invalid username or password' });
    }

    const isMatch = await lab.comparePassword(password);
    if (!isMatch) {
      return res.status(404).send({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: lab._id }, jwtSecret, { expiresIn: '1h' });

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
};
// uploadMedicalAnalysis ----> Abdo
exports.uploadMedicalAnalysis = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const { labId, userId } = req.params;
      // Ensure the lab and user exist
      const { testname } = req.body; 
      const lab = await Lab.findById(labId);
      const user = await User.findById(userId);

      if (!lab || !user) {
        return res.status(404).json({ message: 'Lab or User not found' });
      }

      // Create a new medical Analysis
      const Medicalanalysis = new MedicalAnalysis({
        lab: labId,
        user: userId,
        testName:testname,
        pdfPath: req.file.path // Save the file path
      });

      await Medicalanalysis.save();

      res.status(201).json(Medicalanalysis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];