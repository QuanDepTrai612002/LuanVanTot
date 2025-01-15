const Category = require("../models/categoryModel");

// Lấy tất cả sản phẩm
exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

