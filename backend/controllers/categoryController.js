const Category = require('../models/Category');

exports.index = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ message: 'Lỗi lấy danh mục', error: err.message });
  }
};