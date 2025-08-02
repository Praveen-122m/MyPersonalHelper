const express = require('express');
const router = express.Router();
const {
    getHelperProfile,
    updateHelperProfile,
    getAllHelpers,
    getHelperById
} = require('../controllers/helperController');
const { protect, authorize } = require('../middleware/authMiddleware');
// Removed upload middleware import

// Route for a helper to get and update their own profile, no longer accepting files directly
router.route('/profile')
    .get(protect, authorize('helper'), getHelperProfile)
    .put(
        protect,
        authorize('helper'),
        // Removed upload.fields middleware
        updateHelperProfile
    );

router.get('/', getAllHelpers);
router.get('/:id', getHelperById);

module.exports = router;