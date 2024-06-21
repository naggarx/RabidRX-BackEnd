// middlewares/authenticateToken.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env file

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.admin = decoded; // Store the decoded admin information in the request object
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}

module.exports = authenticateToken;
