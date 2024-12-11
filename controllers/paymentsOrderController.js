const BillMain = require('../models/billmainModel');
const PaymentOrder = require('../models/paymentsOrderModel');

const createPayment = async (req, res) => {
    const { bill_id, payment_method, amount, note } = req.body;

    try {
        // Kiểm tra hóa đơn tồn tại
        const bill = await BillMain.findOne({ where: { id: bill_id, status: 'Đã tạo' } });
        if (!bill) {
            console.log("Hóa đơn không tìm thấy hoặc không ở trạng thái 'Đã giao món'");
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn hoặc hóa đơn chưa hoàn thành.' });
        }

        console.log("Amount from client:", amount);
        console.log("Price from database:", bill.price);
        console.log("Type of amount:", typeof amount);
        console.log("Type of price:", typeof bill.price);

        // Kiểm tra số tiền thanh toán khớp với giá trị hóa đơn
        if (parseFloat(amount) !== parseFloat(bill.price)) {
            console.log("Số tiền không khớp!");
            return res.status(400).json({ message: 'Số tiền thanh toán không khớp với tổng giá trị hóa đơn.' });
        }

        // Thêm thông tin thanh toán vào bảng payments
        const payment = await PaymentOrder.create({
            bill_id,
            payment_method,
            amount,
            note,
        });

        // Cập nhật trạng thái hóa đơn
        await bill.update({ status: 'Đã thanh toán' });

        res.status(201).json({ message: 'Thanh toán đã được ghi nhận.', payment });
    } catch (error) {
        console.error('Error creating payment:', error.message);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi ghi nhận thanh toán.', error: error.message });
    }
};


const getPayments = async (req, res) => {
    try {
        const payments = await PaymentOrder.findAll(); // Sử dụng đúng tên model
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy danh sách thanh toán.', error: error.message });
    }
};

module.exports = {
    createPayment,
    getPayments
};
