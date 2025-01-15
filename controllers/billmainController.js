const BillMain = require('../models/billmainModel');
const sequelize = require('../config/database');
const BillDetails = require('../models/billDetailsModel');
const { Op } = require('sequelize'); 

const createBill = async (req, res) => {
    const { account_id, number_table, items } = req.body;

    try {
        await sequelize.transaction(async (t) => {
            const date = new Date(); // Ngày hiện tại
            const status = "Đã tạo"; // Trạng thái mặc định

            // Tính tổng tiền hóa đơn
            const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

            // Tạo hóa đơn chính với thông tin từ `items`
            const bill = await BillMain.create({
                account_id,
                date,
                price: totalPrice, // Tổng giá trị hóa đơn
                number_table,
                status,
            }, { transaction: t });

            res.status(200).json({ message: "Hóa đơn đã được tạo thành công.", bill });
        });
    } catch (error) {
        console.error("Error creating bill:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi khi tạo hóa đơn.", error: error.message });
    }
};

const getAllBill = async (req, res) => {
  try {
    const bill = await BillMain.findAll();
    res.json(bill);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getAllBillDate = async (req, res) => {
  const { date } = req.query; // Lấy ngày từ query parameters
  try {
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const bills = await BillMain.findAll({
      where: {
        date: { 
          [Op.gte]: new Date(new Date(date).setHours(0, 0, 0)),
          [Op.lt]: new Date(new Date(date).setHours(23, 59, 59))
        }
      }
    });

    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createBill,
    getAllBill,
    getAllBillDate
};