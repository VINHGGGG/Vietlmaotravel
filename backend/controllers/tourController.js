const Tour = require('../models/Tour');

exports.createTour = async (req, res) => {
  const required = ['title', 'city', 'address', 'distance', 'photo', 'desc', 'price', 'maxGroupSize', 'startDate'];
  const missing = required.filter(k => req.body[k] === undefined || req.body[k] === '');
  if (missing.length) {
    return res.status(400).json({
      success: false,
      message: `Thiếu trường: ${missing.join(', ')}`
    });
  }

  const newTour = new Tour(req.body);
  try {
    const savedTour = await newTour.save();
    res.status(200).json({
      success: true,
      message: 'Đã tạo tour thành công!',
      data: savedTour
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo tour. Thử lại nhé!',
      error: err.message
    });
  }
};

exports.updateTour = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({
      success: true,
      message: 'Cập nhật thành công!',
      data: updatedTour
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật', error: err.message });
  }
};

exports.deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Đã xóa tour thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi xóa tour', error: err.message });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      success: true,
      count: tours.length,
      message: 'Thành công',
      data: tours
    });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Không tìm thấy dữ liệu', error: err.message });
  }
};

exports.getTourById = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id);
    if (!tour) return res.status(404).json({ success: false, message: 'Không tìm thấy tour này' });
    res.status(200).json({ success: true, message: 'Thành công', data: tour });
  } catch (err) {
    res.status(404).json({ success: false, message: 'Không tìm thấy tour này', error: err.message });
  }
};