const User = require('../models/User');


const createUser = async (req, res) => {
    try {
        const { name, email, password, address, phone, age, emergencyPhone, gender, maritalStatus,
            weight, height, bloodType } = req.body;
        const newUser = new User({
            name,
            email,
            password,
            address,
            phone,
            age,
            emergencyPhone,
            gender,
            maritalStatus,
            weight,
            height,
            bloodType
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } 
    catch (error) 
    {
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

module.exports = {
    createUser,
    viewProfile,

};