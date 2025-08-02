const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        user: { // The customer who made the booking
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Refers to the User model
        },
        helper: { // The service provider assigned to the booking
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Refers to the User model (where helpers are stored)
        },
        service: { // The specific service requested (e.g., 'Electrician - Fan Repair')
            type: String,
            required: true,
        },
        description: { // Detailed description of the task
            type: String,
            required: true,
        },
        bookingDate: { // The date the service is booked for
            type: Date,
            required: true,
        },
        bookingTime: { // The specific time slot (e.g., '10:00 AM - 11:00 AM')
            type: String,
            required: true,
        },
        status: { // Current status of the booking
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'],
            default: 'pending',
        },
        // Optional: Location details for the service (can derive from user's address)
        serviceAddress: {
            type: String,
            required: false, // Can be derived from user.address
        },
        totalCost: { // Estimated or final cost
            type: Number,
            default: 0,
        },
        isPaid: { // Whether the service has been paid for
            type: Boolean,
            default: false,
        },
        paidAt: {
            type: Date,
        },
        // For reviews later
        isReviewed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;