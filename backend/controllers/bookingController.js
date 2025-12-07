const Booking = require('../models/Booking');
const Tour = require('../models/Tour');
const User = require('../models/User'); // Import User model

// 1. Lấy tất cả Booking (Admin xem)
exports.getAllBooking = async(req,res)=>{
    try {
        const books = await Booking.find().sort({ createdAt: -1 }); // Mới nhất lên đầu
        res.status(200).json({
            success:true,
            message:"Thành công",
            data:books
        });
    } catch (err) {
         res.status(500).json({ success:true, message:"Lỗi server" });
    }
}

// 2. Cập nhật trạng thái thanh toán (MỚI)
exports.updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, // Cập nhật isPaid hoặc status
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Đã cập nhật trạng thái!",
            data: updatedBooking
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi cập nhật" });
    }
};

// 3. Lấy danh sách booking của một user cụ thể
exports.getBookingByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        // Tìm user để lấy email
        const user = await User.findById(userId);
        let query = { userId: userId };
        
        if (user) {
            // Nếu tìm thấy user, tìm booking theo userId HOẶC userEmail
            query = {
                $or: [
                    { userId: userId },
                    { userEmail: user.email }
                ]
            };
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            message: "Thành công",
            data: bookings
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

exports.createBooking = async (req, res) => {
  try {
    const {
      tourId,
      fullName,
      guestSize,
      phone,
      bookAt,
      userId,
      userEmail,
      status,
      isPaid
    } = {
      ...req.body,
      guestSize: req.body.guestSize ?? req.body.numPeople
    };

    const required = ['tourId', 'fullName', 'guestSize', 'phone', 'bookAt'];
    const missing = required.filter(k => !({ tourId, fullName, guestSize, phone, bookAt }[k]));
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Thiếu trường bắt buộc: ${missing.join(', ')}`
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tour đã chọn' });
    }

    // Kiểm tra số lượng người
    if (Number(guestSize) > Number(tour.maxGroupSize)) {
        return res.status(400).json({ 
            success: false, 
            message: `Số người vượt quá giới hạn cho phép (${tour.maxGroupSize} người)` 
        });
    }

    const totalPrice = Number(tour.price || 0) * Number(guestSize || 0);

    const newBooking = await Booking.create({
      tourId,
      tourName: tour.title,
      fullName,
      guestSize,
      phone,
      bookAt,
      userId,
      userEmail,
      status,
      isPaid,
      totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Đã đặt tour thành công',
      data: newBooking
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt tour',
      error: err.message
    });
  }
};