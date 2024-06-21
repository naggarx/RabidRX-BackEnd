const Clinic = require('../models/Clinic');

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
