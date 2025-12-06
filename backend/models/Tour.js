const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true, // Tên tour không được trùng nhau
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    startDate: {
        type: Date,
        required: true // Ngày khởi hành
    }
  },
  { timestamps: true } // Tự động tạo trường createdAt và updatedAt
);

module.exports = mongoose.model("Tour", tourSchema);