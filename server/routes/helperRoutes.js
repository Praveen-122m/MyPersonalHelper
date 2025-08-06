const express = require('express');
const router = express.Router();
const {
    getHelperProfile,
    updateHelperProfile,
    getAllHelpers,
    getHelperById
} = require('../controllers/helperController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Ab file upload middleware nahi hai, sirf JSON data aayega
router.route('/profile')
    .get(protect, authorize('helper'), getHelperProfile)
    .put(
        protect,
        authorize('helper'),
        updateHelperProfile
    );

router.get('/', getAllHelpers);
router.get('/:id', getHelperById);

module.exports = router;