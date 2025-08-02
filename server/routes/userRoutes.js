const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // authorize not needed here as protect implicitly checks if user is logged in, and userController handles role logic

// Route for a general user to get and update their own profile
router.route('/profile')
    .get(protect, getUserProfile) // User can get their own profile
    .put(protect, updateUserProfile); // User can update their own profile

module.exports = router;