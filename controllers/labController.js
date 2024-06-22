const Lab = require('../models/Lab');

exports.createLab = async (req, res) => {
  try {
    const Lab = new Lab(req.body);
    await Lab.save();
    res.status(201).send(Lab);
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
    const Lab = await Lab.findById(req.params.id);
    if (!Lab) {
      return res.status(404).send();
    }
    res.status(200).send(Lab);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateLab = async (req, res) => {
  try {
    const Lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!Lab) {
      return res.status(404).send();
    }
    res.status(200).send(Lab);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.deleteLab = async (req, res) => {
  try {
    const Lab = await Lab.findByIdAndDelete(req.params.id);
    if (!Lab) {
      return res.status(404).send();
    }
    res.status(200).send(Lab);
  } catch (error) {
    res.status(500).send(error);
  }
};