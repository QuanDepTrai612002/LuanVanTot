const Status = require('../models/statusModel'); 
const WebSocket = require('../config/websocket'); 
const sequelize = require('../config/database'); 
const BillDetails = require('../models/billDetailsModel');

const DEPARTMENTS = {
    EMPLOYEE: '1',
    KITCHEN: '2',
    RUNNER: '3',
};

const OrderController = {
    updateOrderStatus: async (req, res) => {
        const { order_id, department, status, account_id } = req.body;
        if (!order_id || !department || !status || !account_id) {
            return res.status(400).json({ message: 'Thiếu thông tin đơn hàng, bộ phận, trạng thái hoặc account_id' });
        }

        let column;
        if (department === DEPARTMENTS.EMPLOYEE) column = 'status_nhanvien';
        else if (department === DEPARTMENTS.KITCHEN) column = 'status_bep';
        else if (department === DEPARTMENTS.RUNNER) column = 'status_nhanvien_chay';
        else return res.status(400).json({ message: 'Bộ phận không hợp lệ' });

        try {
            // Cập nhật trạng thái trong cơ sở dữ liệu
            await Status.updateStatus(order_id, column, status, account_id);

            // Gửi thông báo qua WebSocket
            WebSocket.notifyClients({
                type: 'Có món ăn',
                order_id,
                department,
                status,
                account_id,
            });

            res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (err) {
            console.error('Lỗi cập nhật trạng thái:', err.message);
            res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái', error: err.message });
        }
    },

    // Lấy trạng thái đơn hàng
    getAllStatus: async (req, res) => {
      try {
        const status = await Status.findAll();
        res.json(status);
      } catch (error) {
        res.status(500).send(error.message);
      }
    },
    getOrderStatusByAccountId: async (req, res) => {
      const { account_id } = req.body;
      if (!account_id) {
          return res.status(400).json({ message: "Thiếu account_id trong yêu cầu" });
      }
  
      try {
          const result = await Status.getOrderStatusByAccountId(account_id);
  
          if (!result || result.length === 0) {
              return res.status(404).json({ message: `Không có trạng thái nào cho account_id = ${account_id}` });
          }
  
          // Trả về kết quả nếu tìm thấy
          res.status(200).json(result);
      } catch (err) {
          console.error("Lỗi lấy trạng thái theo account_id:", err.message);
          res.status(500).json({ message: "Lỗi khi lấy trạng thái đơn hàng", error: err.message });
      }
  },
  
  getStatusKitchen: async (req, res) => {
    const { account_id, status } = req.body; // Lấy `account_id` và `status` từ body

    if (!account_id) {
        return res.status(400).json({ message: 'Thiếu account_id trong yêu cầu.' });
    }

    try {
        // Điều kiện lọc
        const whereCondition = { account_id };

        if (status) {
            whereCondition.status = status; // Thêm điều kiện nếu `status` được truyền
        }

        const result = await Status.findAll({
            where: whereCondition,
        });

        if (!result || result.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy trạng thái nào phù hợp với yêu cầu.` });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Lỗi lấy trạng thái:', error.message);
        res.status(500).json({ message: 'Lỗi khi lấy trạng thái.', error: error.message });
    }
},


  //Xoa don hang
  deleteStatus: async (req, res) => {
    const { id } = req.params;
  
    try {
      const status = await Status.findByPk(id);
  
      if (!status) {
        return res.status(404).send("That bai");
      }
      await status.destroy();
      res.status(200).send("Xoa san pham thanh cong");
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getStatusByTable: async (req, res) => {
    const { number_table, status} = req.body;  // Nhận dữ liệu từ body
  
    if (!number_table || !status) {
      return res.status(400).json({ message: "Thiếu number_table hoặc status_name trong yêu cầu" });
    }
  
    try {
      const result = await Status.findAll({
        where: {
          number_table: number_table,
          status: status  // Truy vấn với status_name
        }
      });
  
      if (!result || result.length === 0) {
        return res.status(404).json({ message: `Không có trạng thái nào cho number_table = ${number_table} và status = ${status}` });
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Lỗi lấy trạng thái:", err.message);
      res.status(500).json({ message: "Lỗi khi lấy trạng thái", error: err.message });
    }
  },  
    // Thêm trạng thái mới từ bảng CartOrder hoặc Status
    addOrderStatusFromCartOrder: async (req, res) => {
        const { statusID, department, account_id } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!statusID) {
            return res.status(400).json({ message: 'Thiếu thông tin statusID.' });
        }

        try {
            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            await sequelize.transaction(async (t) => {
                const statusOrder = await Status.findOne({ where: { id: statusID }, transaction: t });

                if (!statusOrder) {
                    throw new Error(`Không tìm thấy đơn hàng với ID: ${statusID}`);
                }

                const { product_name, number_table, count } = statusOrder;

                // Thêm trạng thái vào bảng order_status
                await Status.create(
                    {
                        order_id: statusOrder.id,
                        department,
                        account_id,
                        status: 'Đang xử lý',
                        updated_at: new Date(),
                        note: null,
                        product_name,
                        number_table,
                        price,
                        count,
                    },
                    { transaction: t }
                );
                await statusOrder.destroy({ transaction: t });
            });

            res.status(200).json({ message: 'Đơn hàng đã được xử lý và thêm vào bảng order_status' });
        } catch (error) {
            console.error('Lỗi khi thêm dữ liệu vào bảng order_status:', error.message);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu', error: error.message });
        }
    },
    transferStatusToBill: async (req, res) => {
      const { number_table, status, account_id } = req.body;
  
      try {
          // Kiểm tra dữ liệu đầu vào
          if (!number_table || !status || !account_id) {
              return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin: number_table, status, account_id.' });
          }
  
          // Bắt đầu transaction
          await sequelize.transaction(async (t) => {
              // Lấy các đơn hàng từ bảng Status
              const odstatus = await Status.findAll({
                  where: { number_table, status, account_id },
                  transaction: t,
              });
  
              if (!odstatus.length) {
                  throw new Error('Không tìm thấy đơn hàng nào để chuyển.');
              }
  
              // Tạo danh sách các promise để chèn dữ liệu vào bảng Bill
              const transferPromises = odstatus.map((order) =>
                  BillDetails.create(
                      {
                          account_id: order.account_id,
                          date: new Date(), // Thời gian hiện tại
                          number_table: order.number_table,
                          count: order.count,
                          price: order.price,
                          product_name: order.product_name,
                          status: order.status, // Lấy từ `Status
                      },
                      { transaction: t }
                  )
              );
  
              // Chờ tất cả các bản ghi được tạo thành công
              await Promise.all(transferPromises);
  
              // Xóa các bản ghi trong bảng Status
              await Status.destroy({
                  where: { number_table, status, account_id },
                  transaction: t,
              });
          });
  
          // Phản hồi thành công
          res.status(200).json({ message: 'Chuyển dữ liệu từ Status sang Bill thành công.' });
      } catch (error) {
          console.error('Error transferring data:', error.message);
  
          // Phân loại lỗi và trả về phản hồi thích hợp
          if (error.message === 'Không tìm thấy đơn hàng nào để chuyển.') {
              return res.status(404).json({ message: error.message });
          }
  
          res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.', error: error.message });
      }
  },
  
};

module.exports = OrderController;
