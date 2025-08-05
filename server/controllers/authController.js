const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
// Removed Cloudinary import (if it was there)

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone, address, city, state,
            services, experience, bio, hourlyRate, areaOfOperation,
            // Reverted: idProofUrl and profilePicture now come from body (not files)
            aadhaarNumber, idProofUrl, profilePicture } = req.body; 

    if (!name || !email || !password || !phone || !city || !state) {
        res.status(400);
        throw new Error('Please enter all required fields: name, email, password, phone, city, state');
    }
    if (role && !['user', 'helper'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role specified. Role must be "user" or "helper".');
    }

    try {
        const userExistsByEmail = await User.findOne({ email });
        if (userExistsByEmail) {
            res.status(400);
            throw new Error('User with this email already exists');
        }
        const userExistsByPhone = await User.findOne({ phone });
        if (userExistsByPhone) {
            res.status(400);
            throw new Error('User with this phone number already exists');
        }

        const userData = {
            name, email, password, role: role || 'user', phone, address, city, state,
        };

        if (userData.role === 'helper') {
            userData.services = services || [];
            userData.experience = experience || 0;
            userData.bio = bio || '';
            userData.hourlyRate = hourlyRate || 0;
            userData.areaOfOperation = areaOfOperation || [];
            
            // Reverted: Use URLs from body, not file uploads
            userData.aadhaarNumber = aadhaarNumber || '';
            userData.idProofUrl = idProofUrl || ''; // Single URL field
            userData.profilePicture = profilePicture || 'https://via.placeholder.com/150/CCCCCC/FFFFFF?text=Avatar'; // Use provided URL or default

            userData.isIdentityVerified = false; // Always false on registration
            userData.isProfileComplete = !!(userData.bio && userData.services.length > 0 && userData.experience >= 0);
        }

        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone,
                address: user.address, city: user.city, state: user.state,
                isProfileComplete: user.isProfileComplete, profilePicture: user.profilePicture,
                bio: user.bio, services: user.services, experience: user.experience,
                hourlyRate: user.hourlyRate, areaOfOperation: user.areaOfOperation,
                aadhaarNumber: user.aadhaarNumber, idProofUrl: user.idProofUrl, isIdentityVerified: user.isIdentityVerified,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data provided');
        }
    } catch (error) {
        console.error(error);
        if (res.statusCode === 200) res.status(500);
        throw new Error(error.message || 'Server error during registration');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone,
                address: user.address, city: user.city, state: user.state,
                isProfileComplete: user.isProfileComplete, profilePicture: user.profilePicture,
                bio: user.bio, services: user.services, experience: user.experience,
                hourlyRate: user.hourlyRate, areaOfOperation: user.areaOfOperation,
                aadhaarNumber: user.aadhaarNumber, idProofUrl: user.idProofUrl, isIdentityVerified: user.isIdentityVerified,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        console.error(error);
        if (res.statusCode === 200) res.status(500);
        throw new Error(error.message || 'Server error during login');
    }
});

module.exports = { registerUser, loginUser };