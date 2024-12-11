const BillMain = require('../models/billmainModel');
const sequelize = require('../config/database');
const BillDetails = require('../models/billDetailsModel');

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

module.exports = {
    createBill
};