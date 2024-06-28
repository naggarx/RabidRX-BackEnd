const User = require('../models/User');


exports.getPendingDiagnosis= async(req, res) => {
    try {
      const authHeader = req.headers['token'];
      const token =authHeader.split(' ')[1];
      const user = await User.findOne({ token }).exec();
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      if(!user.pendingDiagnosis){
        res.status(204);
      }
      res.status(200).json({'pendingDiagnosis':user.pendingDiagnosis
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
};
  

exports.acceptDiagnosis = async (req, res) => {
    try {
      const authHeader = req.headers['token'];
      const token =authHeader.split(' ')[1];
      const user = await User.findOne({ token }).exec();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      const found = user.pendingDiagnosis.find(el => el._id == req.params.id);
      if (!found) {
        return res.status(400).send('Invalid or expired token');
      }
      user.numPendingNotifications--;
      user.diagnosis.push(found);
      user.pendingDiagnosis = user.pendingDiagnosis.filter(el => el._id != req.params.id);
      await user.save();
  
      res.status(200).json({'message':'Diagnosis added successfully'});
    } catch (error) {
      res.status(500).send(error.toString());
    }
  };
  
 exports.rejectDiagnosis = async (req, res) => {
     try {
        const authHeader = req.headers['token'];
        const token =authHeader.split(' ')[1];
        const user = await User.findOne({ token }).exec();

        if (!user) {
           return res.status(404).send('User not found');
        }
  
        const found = user.pendingDiagnosis.find(el => el._id == req.params.id);
  
        if (!found) {
         return res.status(400).send('Invalid or expired token');
        }

        user.numPendingNotifications--;
        user.pendingDiagnosis = user.pendingDiagnosis.filter(el => el._id != req.params.id);
        await user.save();
  
        res.status(200).json({'message':'Diagnosis rejected successfully'});
    } catch (error) {
      res.status(500).send(error.toString());
    }
  };