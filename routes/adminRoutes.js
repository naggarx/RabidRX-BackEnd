const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticateToken = require('../middlewares/adminauthMiddleware');
const authorizeAdmin = require('../middlewares/authorizeAdmin');


router.post('/signIN', adminController.login);


module.exports = router;
