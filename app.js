const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('./db'); // Import the db connection
const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/users', userRoutes);
app.use('/admin', adminRoutes);