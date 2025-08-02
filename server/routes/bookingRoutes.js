const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getAssignedBookings,
    updateBookingStatus,
    getBookingById,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('user'), createBooking);
router.get('/my-bookings', protect, authorize('user'), getMyBookings);
router.get('/assigned-to-me', protect, authorize('helper'), getAssignedBookings);

// THIS LINE IS CRUCIAL: Must allow BOTH 'user' and 'helper' roles
router.put('/:id/status', protect, authorize('user', 'helper'), updateBookingStatus);

router.get('/:id', protect, getBookingById);

module.exports = router;