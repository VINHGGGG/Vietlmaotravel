const express = require('express');
const { getAllBooking, updateBooking, createBooking } = require('../controllers/bookingController'); // Import thêm
const { verifyAdmin } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', createBooking); // Khách đặt tour
router.get('/', verifyAdmin, getAllBooking); // Chỉ Admin được xem hết
router.put('/:id', verifyAdmin, updateBooking); // API cập nhật trạng thái

module.exports = router;