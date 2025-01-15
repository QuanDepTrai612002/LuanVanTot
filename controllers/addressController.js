const Address = require("../models/addressModel");

// Lấy tất cả sản phẩm
exports.getAll = async (req, res) => {
  try {
    const address = await Address.findAll();
    res.json(address);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.getAddressById = async (req, res) => {
  const { account_id } = req.params;

  try {
    // Tìm địa chỉ theo account_id
    const address = await Address.findAll({ where: { account_id } });

    if (!address) {
      return res.status(404).send("Address not found");
    }

    res.status(200).json(address);
  } catch (error) {
    res.status(500).send(error.message);
  }
};



exports.getAddressesByAccountId = async (req, res) => {
  try {
    const { account_id } = req.query;

    // Kiểm tra account_id có tồn tại hay không
    if (!account_id) {
      return res.status(400).json({ message: 'account_id là bắt buộc' });
    }

    // Truy vấn lọc theo account_id sử dụng Sequelize
    const addresses = await Address.findAll({
      where: { account_id: account_id }, // Điều kiện lọc
    });

    // Kiểm tra nếu không có dữ liệu
    if (addresses.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ nào' });
    }

    // Trả về kết quả
    res.status(200).json(addresses);
  } catch (error) {
    console.error('Lỗi truy vấn:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
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
  
  // Cập nhật địa chỉ
  exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { recipient_name, phone_number, address_line, city, district } = req.body;
  
    try {
      const address = await Address.findByPk(id);
  
      if (!address) {
        return res.status(404).send("Địa chỉ không tồn tại");
      }
  
      // Cập nhật các trường mới nếu có, giữ nguyên nếu không
      address.recipient_name = recipient_name !== undefined ? recipient_name : address.recipient_name;
      address.phone_number = phone_number !== undefined ? phone_number : address.phone_number;
      address.address_line = address_line !== undefined ? address_line : address.address_line;
      address.city = city !== undefined ? city : address.city;
      address.district = district !== undefined ? district : address.district;
  
      await address.save();
      res.status(200).json(address);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  



