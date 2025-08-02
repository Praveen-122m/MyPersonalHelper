const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // We use the User model for all user types
const jwt = require('jsonwebtoken'); // Needed if we regenerate token on profile update

// Helper function to generate JWT token (copied from authController for internal use here)
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (Any authenticated user)
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is set by the protect middleware (from authMiddleware.js)
    const user = await User.findById(req.user._id).select('-password'); // Exclude password from response

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            role: user.role,
            // Include helper specific fields if it's a helper (they just won't be updatable via this route)
            profilePicture: user.profilePicture,
            bio: user.bio,
            services: user.services,
            experience: user.experience,
            hourlyRate: user.hourlyRate,
            areaOfOperation: user.areaOfOperation,
            availability: user.availability,
            isProfileComplete: user.isProfileComplete,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private (Any authenticated user)
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Update basic user info fields if provided in request body
        user.name = req.body.name !== undefined ? req.body.name : user.name;
        user.email = req.body.email !== undefined ? req.body.email : user.email; // Email usually not editable from profile
        user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
        user.address = req.body.address !== undefined ? req.body.address : user.address;
        user.city = req.body.city !== undefined ? req.body.city : user.city;
        user.state = req.body.state !== undefined ? req.body.state : user.state;

        // Password update (if provided in request body)
        if (req.body.password) {
            user.password = req.body.password; // Mongoose pre-save hook in User.js will hash it
        }

        // IMPORTANT: Do NOT update role or helper-specific fields through this general user profile update route.
        // Helper fields (profilePicture, bio, services, etc.) should only be updated via the dedicated /api/helpers/profile route.
        // We just ensure they are not accidentally set to undefined if not provided in the body.
        user.profilePicture = user.profilePicture;
        user.bio = user.bio;
        user.services = user.services;
        user.experience = user.experience;
        user.hourlyRate = user.hourlyRate;
        user.areaOfOperation = user.areaOfOperation;
        user.availability = user.availability;
        user.isProfileComplete = user.isProfileComplete;

        const updatedUser = await user.save(); // Save the updated user object to MongoDB

        // Respond with updated user data and a new token (if password changed or user info updated)
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            city: updatedUser.city,
            state: updatedUser.state,
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture,
            bio: updatedUser.bio,
            services: updatedUser.services,
            experience: updatedUser.experience,
            hourlyRate: updatedUser.hourlyRate,
            areaOfOperation: updatedUser.areaOfOperation,
            availability: updatedUser.availability,
            isProfileComplete: updatedUser.isProfileComplete,
            token: generateToken(updatedUser._id, updatedUser.role), // Regenerate token with updated info
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile,
};