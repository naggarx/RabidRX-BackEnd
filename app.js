const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Import the db connection
const userRoutes = require('./routes/UserRoutes'); // Adjust the path as necessary

const app = express();

// Middleware
app.use(bodyParser.json());
// Other middleware and route setup
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use('/users', userRoutes);