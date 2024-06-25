const Clinic = require('../models/Clinic');
const multer = require('multer'); 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

exports.createClinic = async (req, res) => {
  try {
    const clinic = new Clinic(req.body);
    await clinic.save();
    res.status(201).send(clinic);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find();
    res.status(200).send(clinics);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id);
    if (!clinic) {
      return res.status(404).send();
    }
    res.status(200).send(clinic);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!clinic) {
      return res.status(404).send();
    }
    res.status(200).send(clinic);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteClinic = async (req, res) => {
  try {
    const clinic = await Clinic.findByIdAndDelete(req.params.id);
    if (!clinic) {
      return res.status(404).send();
    }
    res.status(200).send(clinic);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const clinic = await Clinic.findOne({ username });
    if (!clinic) {
      return res.status(404).send({ error: 'Invalid username or password' });
    }

    const isMatch = await clinic.comparePassword(password);
    if (!isMatch) {
      return res.status(404).send({ error: 'Invalid username or password' });
    }
    const token = jwt.sign({ id: clinic._id }, jwtSecret, { expiresIn: '1h' });
    clinic.token=token; 
    await clinic.save();
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
};

// get id of clinic ----> Abdo
exports.getId = async (req, res) => {
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1];
    const clinic = await Clinic.findOne({ token }).exec();
    if (!clinic) {
      return res.status(404).send();
    }
    res.status(200).json({'id':clinic._id});
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.uploadDiagnosis = [
  upload.single('pdf'),
  async (req, res) => {
    try {
      const { clinicId, userId } = req.params;

      // Ensure the clinic and user exist
      const clinic = await Clinic.findById(clinicId);
      const user = await User.findById(userId);

      if (!clinic || !user) {
        return res.status(404).json({ message: 'Clinic or User not found' });
      }

      // Create a new diagnosis
      const diagnosis ={
        clinic: clinicId,
        user: userId,
        pdfPath: req.file.path // Save the file path
      };

      user.numPendingNotifications++;
      user.pendingDiagnosis.push(diagnosis);
      await user.save();

      res.status(201).json(diagnosis);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

// logout --> Abdo
exports.logout = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    if (!token) return res.sendStatus(400);//validation error
    const found = await Clinic.findOne({ token }).exec();
    if (!found) { 
        return res.sendStatus(400);//validation error
    }
    found.token = '';
    await found.save();
    res.sendStatus(204);//No content
   } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
 }