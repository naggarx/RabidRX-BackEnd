const Lab = require('../models/Lab');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET

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