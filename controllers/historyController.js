const Cart = require("../models/cartModel");
const History = require("../models/historyModel");

// Lấy tất cả sản phẩm
exports.getAll = async (req, res) => {
  try {
    const history = await History.findAll();
    res.json(history);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Tạo địa chỉ mới
exports.createAddress = async (req, res) => {
    try {
      const requiredFields = [
        "account_id",
        "name",
        "phone_number",
        "address_line",
        "city",
        "district"
      ];
  
      const missingFields = requiredFields.filter((field) => !req.body[field]);
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: "All fields are required",
          missingFields: missingFields,
        });
      }
  
      // Không cần id, MySQL tự động tăng
      if (req.body.id) {
        return res.status(400).json({ error: "Không cần thêm id vào" });
      }
  
      // Tạo địa chỉ mới
      const newAddress = await Address.create(req.body);
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  //Lay theo account_id
  exports.getHistoryById = async (req, res) => {
    const { account_id } = req.params;
  
    try {
      // Tìm địa chỉ theo account_id
      const address = await History.findAll({ where: { account_id } });
  
      if (!address) {
        return res.status(404).send("Address not found");
      }
  
      res.status(200).json(address);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Xóa địa chỉ
  exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
  
    try {
      const address = await Address.findByPk(id);
  
      if (!address) {
        return res.status(404).send("Địa chỉ không tồn tại");
      }
  
      await address.destroy();
      res.status(200).send("Xóa địa chỉ thành công");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  



