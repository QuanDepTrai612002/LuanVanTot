const Account = require("../models/accountModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require("../routers/accountRouter");
const { secret } = require("../config");

exports.getAllUsers = async (req, res) => {
  try {
    const accounts = await Account.findAll();
    res.json(accounts);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Có vấn đề trong việc lấy danh sách người dùng");
  }
};
exports.Dangnhap = async (req, res) => {
  try {
    // Tìm người dùng trong cơ sở dữ liệu dựa trên tên (name)
    const user = await Account.findOne({ where: { name: req.body.name } });

    if (!user) {
      return res.status(404).send("Nguoi dung không tồn tại");
    }

    // Kiểm tra mật khẩu người dùng
    if (req.body.password != user.dataValues.password) {
      return res.status(401).send({ auth: false, token: null });
    }

    // Tạo mã token, bao gồm id và role
    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.dataValues.role  // Thêm role vào payload của token
      },
      secret,
      {
        expiresIn: '24h'  // Token có hiệu lực trong 24 giờ
      }
    );

    // Trả về token trong phản hồi
    res.status(200).json({ auth: true, token });
  } catch (e) {
    console.log(e);
    res.status(500).send('Có vấn đề trong quá trình đăng nhập');
  }
};

exports.createAccount = async (req, res) => {
  try {
    const requiredFields = ["name", "email", "phone_number", "address", "password"];

    // Kiểm tra các trường bắt buộc
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Thiếu thông tin",
        missingFields: missingFields
      });
    }

    const { name, email, phone_number, address, password, role = 0 } = req.body;

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email không hợp lệ"
      });
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({
        error: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: "Email đã tồn tại"
      });
    }
    const existingName = await Account.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({
        error: "Name đã tồn tại"
      });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo dữ liệu tài khoản
    const userData = {
      name,
      email,
      phone_number,
      address,
      password,
      // password: hashedPassword,
      role
    };

    // Tạo tài khoản mới
    const user = await Account.create(userData);

    res.status(201).json({
      message: "Tài khoản đã được tạo thành công",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      res.status(400).json({
        error: "Lỗi xác thực",
        details: error.errors.map(e => e.message)
      });
    } else {
      console.error("Error creating account:", error);
      res.status(500).json({
        error: "Có vấn đề trong việc tạo tài khoản",
        details: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
};

//Theo Id
exports.getAccountById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const account = await Account.findByPk(id);
  
      if (!account) {
        return res.status(404).send("Account not found");
      }
  
      res.status(200).json(account);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
exports.deleteUser = async (req, res) => {
  try {
    const user = await Account.findByPk(req.params.id_user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.destroy();
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Có vấn đề trong việc xóa người dùng");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await Account.findByPk(req.params.id_user);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const { name, password, role } = req.body;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    user.name = name || user.name;
    user.role = role || user.role;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Có vấn đề trong việc cập nhật người dùng");
  }
};
