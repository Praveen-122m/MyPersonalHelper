const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
// Removed Cloudinary import (if it was there)

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const getHelperProfile = asyncHandler(async (req, res) => {
    const helper = await User.findById(req.user._id).select('-password');

    if (helper && helper.role === 'helper') {
        res.json({
            _id: helper._id, name: helper.name, email: helper.email, phone: helper.phone,
            address: helper.address, city: helper.city, state: helper.state,
            profilePicture: helper.profilePicture, bio: helper.bio, services: helper.services,
            experience: helper.experience, averageRating: helper.averageRating,
            numReviews: helper.numReviews, hourlyRate: helper.hourlyRate,
            areaOfOperation: helper.areaOfOperation, availability: helper.availability,
            isProfileComplete: helper.isProfileComplete,
            aadhaarNumber: helper.aadhaarNumber, idProofUrl: helper.idProofUrl, isIdentityVerified: helper.isIdentityVerified, // Reverted
        });
    } else {
        res.status(404);
        throw new Error('Helper not found or not authorized');
    }
});

const updateHelperProfile = asyncHandler(async (req, res) => {
    const helper = await User.findById(req.user._id).select('-password');

    if (helper && helper.role === 'helper') {
        helper.name = req.body.name !== undefined ? req.body.name : helper.name;
        helper.email = req.body.email !== undefined ? req.body.email : helper.email;
        helper.phone = req.body.phone !== undefined ? req.body.phone : helper.phone;
        helper.address = req.body.address !== undefined ? req.body.address : helper.address;
        helper.city = req.body.city !== undefined ? req.body.city : helper.city;
        helper.state = req.body.state !== undefined ? req.body.state : helper.state;

        helper.bio = req.body.bio !== undefined ? req.body.bio : helper.bio;
        helper.services = Array.isArray(req.body.services) ? req.body.services.filter(s => s.trim() !== '') : helper.services;
        if (typeof req.body.services === 'string') {
            helper.services = req.body.services.split(',').map(s => s.trim()).filter(s => s !== '');
        }

        helper.experience = req.body.experience !== undefined ? req.body.experience : helper.experience;
        helper.hourlyRate = req.body.hourlyRate !== undefined ? req.body.hourlyRate : helper.hourlyRate;

        helper.areaOfOperation = Array.isArray(req.body.areaOfOperation) ? req.body.areaOfOperation.filter(a => a.trim() !== '') : helper.areaOfOperation;
        if (typeof req.body.areaOfOperation === 'string') {
             helper.areaOfOperation = req.body.areaOfOperation.split(',').map(a => a.trim()).filter(a => a !== '');
        }

        helper.availability = req.body.availability !== undefined ? req.body.availability : helper.availability;
        
        helper.isProfileComplete = !!(helper.bio && helper.services.length > 0 && helper.experience !== undefined && helper.experience !== null && helper.experience >= 0);

        // Reverted: Use URLs from body, not file uploads
        helper.profilePicture = req.body.profilePicture !== undefined ? req.body.profilePicture : helper.profilePicture; // Handle profilePicture from body
        helper.aadhaarNumber = req.body.aadhaarNumber !== undefined ? req.body.aadhaarNumber : helper.aadhaarNumber;
        helper.idProofUrl = req.body.idProofUrl !== undefined ? req.body.idProofUrl : helper.idProofUrl; // Reverted to single URL


        if (req.body.password) {
            helper.password = req.body.password;
        }

        const updatedHelper = await helper.save();

        res.json({
            _id: updatedHelper._id, name: updatedHelper.name, email: updatedHelper.email,
            phone: updatedHelper.phone, address: updatedHelper.address,
            city: updatedHelper.city, state: updatedHelper.state,
            profilePicture: updatedHelper.profilePicture, bio: updatedHelper.bio,
            services: updatedHelper.services, experience: updatedHelper.experience,
            averageRating: updatedHelper.averageRating, numReviews: updatedHelper.numReviews,
            hourlyRate: updatedHelper.hourlyRate, areaOfOperation: updatedHelper.areaOfOperation,
            availability: updatedHelper.availability, isProfileComplete: updatedHelper.isProfileComplete,
            aadhaarNumber: updatedHelper.aadhaarNumber, idProofUrl: updatedHelper.idProofUrl, isIdentityVerified: updatedHelper.isIdentityVerified, // Reverted
        });
    } else {
        res.status(404);
        throw new Error('Helper not found or not authorized');
    }
});

const getAllHelpers = asyncHandler(async (req, res) => {
    const { keyword, city, service, minRating, minExperience, areaOfOperation, availability } = req.query;

    const query = { role: 'helper' };

    if (keyword) {
        query.$or = [{ name: { $regex: keyword, $options: 'i' } }, { bio: { $regex: keyword, $options: 'i' } }];
    }

    if (city) {
        query.city = { $regex: new RegExp(city), $options: 'i' };
    }

    if (service) {
        query.services = { $in: [new RegExp(service, 'i')] };
    }

    if (minRating) {
        query.averageRating = { $gte: Number(minRating) };
    }

    if (minExperience) {
        query.experience = { $gte: Number(minExperience) };
    }

    if (areaOfOperation) {
        query.areaOfOperation = { $in: [new RegExp(areaOfOperation, 'i')] };
    }

    if (availability) {
        query.availability = { $regex: new RegExp(availability), $options: 'i' };
    }
    
    const helpers = await User.find(query).select('-password');
    res.json(helpers);
});

const getHelperById = asyncHandler(async (req, res) => {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        res.status(400);
        throw new Error('Invalid Helper ID format.');
    }

    const helper = await User.findById(req.params.id).select('-password');

    if (helper && helper.role === 'helper') {
        res.json(helper);
    } else {
        const errorMessage = helper ? `User found, but is not a helper (role: ${helper.role}).` : 'Helper not found in the database.';
        res.status(404);
        throw new Error(errorMessage);
    }
});

module.exports = {
    getHelperProfile,
    updateHelperProfile,
    getAllHelpers,
    getHelperById
};