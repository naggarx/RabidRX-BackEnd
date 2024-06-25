const User = require('../models/User');


exports.getPendingMedicalAnalysis= async(req, res) => {
    try {
      
      const authHeader = req.headers['token'];
      const token =authHeader.split(' ')[1];
      const user = await User.findOne({ token }).exec();
    //  console.log(user.firstName+" "+token);

      if (!user) {
        return res.status(404).send('User not found');
      }
  
      
      if(!user.PendingMedicalAnalysis){
        res.status(204);
      }
      res.status(200).json({'pendingMedicalAnalysis':user.pendingMedicalAnalysis
      });
    } catch (error) {
      res.status(500).send(error.toString());
    }
};
  

exports.acceptMedicalAnalysis = async (req, res) => {
    try {
      const authHeader = req.headers['token'];
      const token =authHeader.split(' ')[1];
      const user = await User.findOne({ token }).exec();
  
      if (!user) {
        return res.status(404).send('User not found');
      }
      const found = user.pendingMedicalAnalysis.find(el => el._id == req.params.id);
      if (!found) {
        return res.status(400).send('Invalid or expired token');
      }
      user.numPendingNotifications--;
      user.medicalAnalysis.push(found);
      user.pendingMedicalAnalysis = user.pendingMedicalAnalysis.filter(el => el._id != req.params.id);
      await user.save();
  
      res.status(200).json({'message':'Medical analysis added successfully'});
    } catch (error) {
      res.status(500).send(error.toString());
    }
  };
  
 exports.rejectMedicalAnalysis = async (req, res) => {
     try {
        const authHeader = req.headers['token'];
        const token =authHeader.split(' ')[1];
        const user = await User.findOne({ token }).exec();

        if (!user) {
           return res.status(404).send('User not found');
        }
  
        const found = user.pendingMedicalAnalysis.find(el => el._id == req.params.id);
  
        if (!found) {
         return res.status(400).send('Invalid or expired token');
        }

        user.numPendingNotifications--;
        user.pendingMedicalAnalysis = user.pendingMedicalAnalysis.filter(el => el._id != req.params.id);
        await user.save();
  
        res.status(200).send('Medical analysis rejected successfully');
    } catch (error) {
      res.status(500).send(error.toString());
    }
  };