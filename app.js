
const express = require('express');
const app = express();
const mongoose = require('./db');

// Other middleware and route setup

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
