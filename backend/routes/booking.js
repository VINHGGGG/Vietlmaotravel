const express = require('express');
const { getAllBooking, createBooking } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', getAllBooking);
router.post('/', createBooking);

module.exports = router;