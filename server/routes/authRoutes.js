const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
// Removed upload middleware import

// Route for registration, no longer accepting files directly
router.post(
    '/register',
    // Removed upload.fields middleware
    registerUser
);

router.post('/login', loginUser);

module.exports = router;