const PaymentOnline = require('../models/paymentOnlineModel');


const getAllPayment = async (req, res) => {
  try {
    const paymentOnline = await PaymentOnline.findAll();
    res.json(paymentOnline);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
const getPaymentAccount = async (req, res) => {
    const { account_id } = req.params;
  
    try {
      // Tìm bản ghi theo account_id
      const paymentOnline = await PaymentOnline.findAll({
        where: { account_id },
      });
  
      if (!paymentOnline) {
        // Trả về lỗi nếu không tìm thấy bản ghi
        return res.status(404).json({
          message: `Không tìm thấy thông tin thanh toán cho account_id: ${account_id}`,
        });
      }
  
      // Trả về kết quả nếu tìm thấy
      res.status(200).json({
        message: "Thông tin thanh toán được tìm thấy",
        data: paymentOnline,
      });
    } catch (error) {
      // Xử lý lỗi hệ thống
      console.error("Lỗi khi lấy thông tin thanh toán:", error);
      res.status(500).json({
        message: "Đã xảy ra lỗi khi lấy thông tin thanh toán",
        error: error.message,
      });
    }
  };
  
const updateStatus = async (req, res) => {
    const paymentId = req.params.id; // Lấy ID từ URL
    const { payment_status } = req.body; // Lấy trạng thái mới từ body của request
  
    try {
      const [updatedRows] = await PaymentOnline.update(
        { payment_status }, // Cập nhật trạng thái mới
        { where: { id: paymentId } } // Tìm bản ghi cần cập nhật
      );
  
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy thanh toán với ID này.' });
      }
  
      res.status(200).json({ message: 'Cập nhật trạng thái thành công.' });
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật trạng thái.', error });
    }
  };

module.exports = {
    getAllPayment,
    updateStatus,
    getPaymentAccount
};
