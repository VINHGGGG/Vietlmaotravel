const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

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

exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      tourName,
      fullName,
      guestSize,
      phone,
      bookAt,
      status,
      isPaid
    } = {
      ...req.body,
      guestSize: req.body.guestSize ?? req.body.numPeople
    };

    const required = ['tourName', 'fullName', 'guestSize', 'phone', 'bookAt'];
    const missing = required.filter(k => !({ tourName, fullName, guestSize, phone, bookAt }[k]));
    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Thiếu trường bắt buộc: ${missing.join(', ')}`
      });
    }

    const newBooking = await Booking.create({
      userId,
      userEmail,
      tourName,
      fullName,
      guestSize,
      phone,
      bookAt,
      status,
      isPaid
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