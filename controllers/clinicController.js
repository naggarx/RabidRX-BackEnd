const Clinic = require('../models/Clinic');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

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

    res.status(200).send({ token });
  } catch (error) {
    res.status(500).send(error);
  }
};
