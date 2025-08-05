const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
// Removed upload middleware import (if it was there)

// Route for registration, now accepting JSON data (no file upload middleware)
router.post('/register',
    registerUser
);

router.post('/login', loginUser);

module.exports = router;