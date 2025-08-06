const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Ab file upload middleware nahi hai, sirf JSON data aayega
router.post(
    '/register',
    registerUser
);

router.post('/login', loginUser);

module.exports = router;