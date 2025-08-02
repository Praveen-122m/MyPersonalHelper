const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const User = require('../models/User');

const createBooking = asyncHandler(async (req, res) => {
    const { helperId, service, description, bookingDate, bookingTime, serviceAddress, totalCost } = req.body;
    if (!helperId || !service || !description || !bookingDate || !bookingTime) {
        res.status(400);
        throw new Error('Please fill all required booking details.');
    }
    if (req.user.role !== 'user') {
        res.status(403);
        throw new Error('Only customers can create bookings.');
    }
    const helper = await User.findById(helperId);
    if (!helper || helper.role !== 'helper') {
        res.status(404);
        throw new Error('Selected helper not found or is not a service provider.');
    }
    const booking = await Booking.create({
        user: req.user._id, helper: helperId, service, description,
        bookingDate: new Date(bookingDate), bookingTime,
        serviceAddress: serviceAddress || req.user.address,
        totalCost: totalCost || 0, status: 'pending',
    });
    if (booking) {
        res.status(201).json({ message: 'Booking created successfully!', bookingId: booking._id, status: booking.status, booking });
    } else {
        res.status(400);
        throw new Error('Invalid booking data');
    }
});

const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('helper', 'name email phone profilePicture services').sort({ bookingDate: -1, createdAt: -1 });
    res.json(bookings);
});

const getAssignedBookings = asyncHandler(async (req, res) => {
    if (req.user.role !== 'helper') {
        res.status(403);
        throw new Error('Only helpers can view assigned bookings.');
    }
    const bookings = await Booking.find({ helper: req.user._id }).populate('user', 'name email phone address').sort({ bookingDate: -1, createdAt: -1 });
    res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const isBookingOwner = booking.user.toString() === req.user._id.toString();
    const isAssignedHelper = booking.helper.toString() === req.user._id.toString();

    if (isBookingOwner && status === 'cancelled') {
        booking.status = status;
    } else if (isAssignedHelper) {
        const validHelperStatuses = ['confirmed', 'completed', 'cancelled', 'rejected'];
        if (!validHelperStatuses.includes(status)) {
            res.status(400);
            throw new Error(`Invalid status for helper: ${status}`);
        }
        booking.status = status;
    } else {
        // This is the error thrown if unauthorized
        res.status(403);
        throw new Error('Not authorized to update this booking status.');
    }

    if (status === 'completed' && !booking.isPaid) {
        booking.isPaid = true;
        booking.paidAt = new Date();
    }

    const updatedBooking = await booking.save();
    res.json({ message: 'Booking status updated successfully!', bookingId: updatedBooking._id, newStatus: updatedBooking.status, updatedBooking });
});

const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email phone').populate('helper', 'name email phone services');
    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }
    if (booking.user._id.toString() !== req.user._id.toString() &&
        booking.helper._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this booking');
    }
    res.json(booking);
});

module.exports = { createBooking, getMyBookings, getAssignedBookings, updateBookingStatus, getBookingById };