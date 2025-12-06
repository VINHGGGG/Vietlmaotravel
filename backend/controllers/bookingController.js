const Booking = require('../models/Booking');
const Tour = require('../models/Tour');

exports.getAllBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy danh sách đặt tour',
      error: err.message
    });
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