const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('./db'); // Import the db connection
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const labRoutes = require('./routes/labRoutes');
const notificationRoutes=require('./routes/notificationRoutes');
const path = require('path');
const app = express();
app.use('/uploads/profile_images', express.static(path.join(__dirname, 'uploads/profile_images')));
app.use(cors());
app.use(bodyParser.json());

app.listen(3000, () => { 
  console.log('Server is running on port 3000');
});

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.use('/clinics', clinicRoutes);
app.use('/labs', labRoutes);
app.use('/notifications', notificationRoutes);
