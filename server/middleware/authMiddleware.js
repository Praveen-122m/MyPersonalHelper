const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const authorize = (...roles) => { // This function correctly checks if req.user.role is in the allowed roles
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403); // Forbidden
            throw new Error(`Not authorized as ${req.user ? req.user.role : 'guest'}. Access denied.`);
        }
        next();
    };
};

module.exports = { protect, authorize };