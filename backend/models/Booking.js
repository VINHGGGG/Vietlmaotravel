const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tourId: {
      type: String,
      required: true,
    },
    userId: {
      type: String, // ID của người đặt (nếu họ đã đăng nhập)
    },
    userEmail: {
      type: String, // Email người đặt
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true, // Số lượng người đi
    },
    phone: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    bookAt: {
      type: Date,
      required: true, // Ngày đặt tour
    },
    status: {
        type: String,
        default: "pending", // pending (chờ duyệt), approved (đã duyệt), cancelled (đã hủy)
    },
    isPaid: {
        type: Boolean,
        default: false, // false: chưa thanh toán, true: đã thanh toán
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);