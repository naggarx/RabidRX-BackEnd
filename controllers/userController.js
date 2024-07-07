const User = require('../models/User');
const Lab= require('../models/Lab');
const Clinic = require('../models/Clinic');
const { exec } = require('child_process');
const path = require('path');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');
const upload = require('../middlewares/multer');
const { use } = require('../routes/userRoutes');
const axios = require('axios');

const createUser = async (req, res) => {
  try {
      const { 
          firstName, 
          lastName, 
          email, 
          password, 
          address, 
          phone, 
          age, 
          gender, 
          maritalStatus, 
          weight, 
          height, 
          bloodType
      } = req.body;
      const personalMedicalHistory = JSON.parse(req.body.personalMedicalHistory);
      const personalSurgicalHistory = JSON.parse(req.body.personalSurgicalHistory);
      const personalAllergiesHistory = JSON.parse(req.body.personalAllergiesHistory);
      const familyMedicalHistory = JSON.parse(req.body.familyMedicalHistory);
      const emergencyContacts = JSON.parse(req.body.emergencyContacts);
      const newUser = new User({
          firstName,
          lastName,
          email,
          password,
          address,
          phone,
          age,
          gender,
          maritalStatus,
          weight,
          height,
          bloodType,
          personalMedicalHistory,
          personalSurgicalHistory,
          personalAllergiesHistory,
          familyMedicalHistory,
          emergencyContacts,
          profileImage:  req.file ? req.file.path : null,
          fileUrl : `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


const viewProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
    
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// update password ---> Abdo
const updatePassword = async (req, res) => {
   // const token =localStorage.getItem("")
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1];
    const {oldPassword, newPassword } = req.body;
    try {
      const user = await User.findOne({ token }).exec();
      if (!user) {
        return res.status(404).json({ 'message': 'User not found' });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password); 
      if (!isMatch) {
        return res.status(400).json({ 'message': 'password is incorrect' });
      }
      
      user.password=newPassword;
      await user.save();

      res.status(200).json({ 'message': 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 'message': 'Server error' });
  }
};

// updateProfile --> Abdo
const updateProfile = async (req, res) => {
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    const userId =await User.findOne({ token }).exec();
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,  
      runValidators: true 
    });
    if (!updatedUser) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    res.status(200).json({'message': 'updated successfully'}); 
  } catch (err) { 
    res.status(500).json({ 'message': 'Server error' });
  }
};


const updateImage=  async (req, res) => {
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    const user =await User.findOne({ token }).exec();
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    user.fileUrl = `${req.protocol}://${req.get('host')}/uploads/profile_images/${req.file.filename}`;
    await user.save();
    res.status(200).json({'message': fileUrl}); 
  } catch (err) { 
    res.status(500).json({ 'message': 'Server error' });
  }
};

// get id by email --->Abdo
const getId = async (req, res) => { 
  const email=req.body.email;
  if (!email) return res.sendStatus(204);//No content
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) { 
      return res.sendStatus(204);//No content
  }
  res.status(200).json({'id':foundUser._id});
}

const userById = async (req, res) => {
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1];
    const lab = await Lab.findOne({ token }).exec();
    const clinic = await Clinic.findOne({ token }).exec();
    const user=await User.findById(req.params.id).exec();
    if (!user||(!lab&&!clinic)) {
      return res.sendStatus(400);
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).send(error);
  }
};

 //get number of pending notification
 const getNumOfNotification = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    if (!token) return res.status(400).json({ 'message': 'token expired or not found' });

    const foundUser = await User.findOne({ token }).exec();

    if (!foundUser) {
      return res.status(400).json({ 'message': 'User not found' });
    }

    res.status(200).json({'numberOfPendingNotification':foundUser.numPendingNotifications});
  } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
}


const getMedicalAnalysis = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    if (!token) return res.status(400).json({ 'message': 'token expired or not found' });

    const foundUser = await User.findOne({ token }).exec();

    if (!foundUser) {
      return res.status(400).json({ 'message': 'User not found' });
    }

    res.status(200).json({'medicalAnalysis':foundUser.medicalAnalysis});
  } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
}


const getDiagnosis = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    if (!token) return res.status(400).json({ 'message': 'token expired or not found' });

    const foundUser = await User.findOne({ token }).exec();

    if (!foundUser) {
      return res.status(400).json({ 'message': 'User not found' });
    }

    res.status(200).json({'diagnosis':foundUser.diagnosis});
  } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
}


const labEvaluation = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    const labID=req.params.id;
    const evaluation=req.body.evaluation;
    
    if (!token) return res.status(400).json({ 'message': 'token expired or not found' });
    const foundUser = await User.findOne({ token }).exec();
    const foundLab = await Lab.findById(labID).exec();
    if (!foundUser) {
      return res.status(400).json({ 'message': 'User not found' });
    }
    if (!foundLab) {
      return res.status(400).json({ 'message': 'Lab not found' });
    }
    foundLab.numOfEvaluation++;
    foundLab.sumOfEvaluation+=evaluation; 
    foundLab.rate = foundLab.calculateRate();
    await foundLab.save();
    res.status(200).json({'message':"lab evaluated successfully"});
  } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
}


const clinicEvaluation = async (req, res) => { 
  try {
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    const clinicID=req.params.id;
    const evaluation=req.body.evaluation;
    
    if (!token) return res.status(400).json({ 'message': 'token expired or not found' });
    const foundUser = await User.findOne({ token }).exec();
    const foundClinic = await Clinic.findById(clinicID).exec();
    if (!foundUser) {
      return res.status(400).json({ 'message': 'User not found' });
    }
    if (!foundClinic) {
      return res.status(400).json({ 'message': 'Clinic not found' });
    }

    
    foundClinic.numOfEvaluation++;
    foundClinic.sumOfEvaluation+=evaluation;
    foundClinic.rate = foundClinic.calculateRate();
    await foundClinic.save();
    res.status(200).json({'message':"Clinic evaluated successfully"});
  } catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
}

const predictDiabetes = async (req, res) => {
  try {
    // console.log('Received data:', req.body); 

    const authHeader = req.headers['token'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }
    
    const token = authHeader.split(' ')[1];

    // Fetch additional data from user database
    const user = await User.findOne({ token }).exec();
    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }

    const { bmi, blood_glucose_level, HbA1c_level, smoking_history } = req.body;

    const inputData = {
      bmi,
      blood_glucose_level,
      HbA1c_level,
      smoking_history,
      gender: user.gender,
      age: user.age,
      hypertension: user.personalMedicalHistory.hypertension,
      heart_disease: user.personalMedicalHistory.heartDisease
    };

    // Log inputData before sending to Python script
    // console.log('Input data to Python script:', inputData);

    const response = await axios.post('http://localhost:5000/predict', inputData);

    const predictionArray = response.data.prediction[0];
    const [notDiabetes, diabetes] = predictionArray;

    if (typeof notDiabetes !== 'number' || typeof diabetes !== 'number') {
      throw new Error('Invalid prediction format');
    }

    let message;
    if (notDiabetes > diabetes) {
      message = `Prediction: Not Diabetes with ${(notDiabetes * 100).toFixed(2)}% certainty`;
    } else {
      message = `Prediction: Diabetes with ${(diabetes * 100).toFixed(2)}% certainty`;
    }
      res.json({ message });

  } catch (error) {
    console.error('Error in predictDiabetes:', error);
    res.status(500).send('Error calling the prediction service');
  }
};


const predictDiabete = async (req, res) => {
  try {
    console.log('Received data:', req.body);

    const authHeader = req.headers['token'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Fetch additional data from user database
    const user = await User.findOne({ token }).exec();
    if (!user) {
      return res.status(500).json({ error: 'User not found' });
    }

    const { bmi, blood_glucose_level, HbA1c_level, smoking_history } = req.body;

    const inputData = {
      bmi,
      blood_glucose_level,
      HbA1c_level,
      smoking_history,
      gender: user.gender,
      age: user.age,
      hypertension: user.personalMedicalHistory.hypertension,
      heart_disease: user.personalMedicalHistory.heartDisease
    };

    // Log inputData before sending to Python script
    console.log('Input data to Python script:', inputData);

    const response = await axios.post('http://localhost:5000/predict', inputData);
    console.log('Prediction response:', response.data);

    // Extracting prediction values from response
    const predictionArray = response.data.prediction[0];
    const [notDiabetes, diabetes] = predictionArray;

    if (typeof notDiabetes !== 'number' || typeof diabetes !== 'number') {
      throw new Error('Invalid prediction format');
    }

    let message;
    if (notDiabetes > diabetes) {
      message = `Prediction: Not Diabetes with ${(notDiabetes * 100).toFixed(2)}% certainty`;
    } else {
      message = `Prediction: Diabetes with ${(diabetes * 100).toFixed(2)}% certainty`;
    }

    res.json({ message });
  } catch (error) {
    console.error('Error in predictDiabetes:', error);
    res.status(500).send('Error calling the prediction service');
  }
};

// get user by qr
const userByQr = async (req, res) => {
  try {
    const user=await User.findById(req.params.id).exec();
    if (!user) {
      return res.sendStatus(400);
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).send(error);
  }
};

// logout --> Abdo
const logout = async (req, res) => { 
  try{
    const authHeader = req.headers['token'];
    const token =authHeader.split(' ')[1]; 
    if (!token) return res.sendStatus(400);//validation error
    const foundUser = await User.findOne({ token }).exec();
    if (!foundUser) { 
        return res.sendStatus(400);//validation error
    }
    foundUser.token = '';
    const result = await foundUser.save();
    res.sendStatus(204);//No content
  }catch (err) {
    res.status(500).json({ 'message': 'Server error' });
  }
 }


 const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 

module.exports = {
    createUser,
    viewProfile,
    updatePassword,
    updateProfile,
    logout,
    predictDiabetes,
    getId,
    getNumOfNotification,
    getMedicalAnalysis,
    getDiagnosis,
    labEvaluation,
    clinicEvaluation,
    getAllUsers,
    userById,
    updateImage,
    userByQr
};