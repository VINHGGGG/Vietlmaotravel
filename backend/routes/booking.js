const express = require('express');
const { getAllBooking, updateBooking, createBooking, getBookingByUserId } = require('../controllers/bookingController'); // Import thêm
const { verifyAdmin, verifyUser } = require('../utils/verifyToken');

const router = express.Router();

router.post('/', createBooking); // Khách đặt tour
router.get('/', verifyAdmin, getAllBooking); // Chỉ Admin được xem hết
router.get('/user/:id', verifyUser, getBookingByUserId); // Khách xem lịch sử đặt tour của mình
router.put('/:id', verifyAdmin, updateBooking); // API cập nhật trạng thái

module.exports = router;