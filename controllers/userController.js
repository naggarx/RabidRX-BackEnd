const User = require('../models/User');
const { exec } = require('child_process');
const path = require('path');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');

const { use } = require('../routes/userRoutes');


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
          bloodType,
          personalMedicalHistory,
          personalSurgicalHistory,
          personalAllergiesHistory,
          familyMedicalHistory,
          emergencyContacts 
      } = req.body;

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
          emergencyContacts
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
  const authHeader = req.headers['token'];
  const token =authHeader.split(' ')[1]; 
  const userId =await User.findOne({ token }).exec();
  const updateData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,  
      runValidators: true 
    });

    if (!updatedUser) {
      return res.status(404).json({ 'message': 'User not found' });
    }

    res.status(200).json({'message': 'updated successfully'}); 
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ 'message': 'Server error' });
  }
};
// logout --> Abdo
const logout = async (req, res) => { 
  const authHeader = req.headers['token'];
  const token =authHeader.split(' ')[1]; 
  if (!token) return res.sendStatus(204);//No content
  const foundUser = await User.findOne({ token }).exec();
  if (!foundUser) { 
      return res.sendStatus(204);//No content
  }

  foundUser.token = '';
  const result = await foundUser.save();
  res.sendStatus(204);//No content
}


const predictDiabetes = async(req, res) => {

  //return res.status(500).json({ error: 'herrrrrrrreeeeeee' });
  // const { bmi, blood_glucose_level, HbA1c_level, smoking_history, userId } = req.body;
  // console.log(userId);
  try {
    console.log(req.body);
    const { bmi, blood_glucose_level, HbA1c_level, smoking_history, userId } = req.body;

    // Fetch additional data from user database
    const user = await User.findById(userId);
    if (!user) {
        return res.status(500).json({ error: 'User not found' });
    }

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
   


      console.log(inputData);
      const pythonInterpreter = 'python'; // Adjust as necessary if Python 3 is installed under a different name (e.g., python3.10)
      const pythonScriptPath = path.join(__dirname, '../python/diabetesPredict.py');

      // Execute the Python 
      const pythonProcess = exec(`python ${pythonScriptPath}`, (error, stdout, stderr) => {
    
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Error in prediction' });
           
            
        }
        try {
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          console.log( lastLine);
            const result = JSON.parse(lastLine);
            res.json(result);
        } catch (parseError) {
            console.error(`parse error: ${parseError}`);
            res.status(500).json({ error: 'Error parsing prediction result' });
        }
    });
    pythonProcess.stdin.write(JSON.stringify(inputData));
    pythonProcess.stdin.end();   

} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
};


module.exports = {
    createUser,
    viewProfile,
    updatePassword,
    updateProfile,
    logout,
    predictDiabetes,
    
};