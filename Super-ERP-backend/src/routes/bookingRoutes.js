const express = require('express');
const router = express.Router();
const { getBookings, getBookingByRef, updateBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

router.get('/', protect, checkPermission('crm.customers.view'), getBookings);
router.get('/:ref', protect, checkPermission('crm.customers.view'), getBookingByRef);
router.put('/:id', protect, checkPermission('crm.customers.edit'), updateBooking);

module.exports = router;
