const express = require('express');
const { createTour, updateTour, deleteTour, getAllTours, getTourById } = require('../controllers/tourController');
const { verifyAdmin } = require('../utils/verifyToken'); // <--- Import vào

const router = express.Router();

// Public routes (Ai cũng xem được)
router.get('/', getAllTours);
router.get('/:id', getTourById);

// Admin routes (Phải có thẻ bài Admin)
router.post('/', createTour); // <--- Chặn ở đây
router.put('/:id', verifyAdmin, updateTour);
router.delete('/:id', verifyAdmin, deleteTour);

module.exports = router;