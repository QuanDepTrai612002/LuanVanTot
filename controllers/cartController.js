const Cart = require('../models/cartModel');
const History = require('../models/historyModel')
const PaymentOnline = require('../models/paymentOnlineModel');
const sequelize = require('../config/database');

// Create a new cart item
const addToCart = async (req, res) => {
  try {
    const { img, date, name, price, count, account_id, product_id } = req.body;

    console.log('Request body:', req.body);

    // Check if the cart item already exists
    let cartItem = await Cart.findOne({
      where: { account_id, product_id }
    });

    if (cartItem) {
      // If item exists, update the count
      cartItem.count += count;
      await cartItem.save();
    } else {
      // If item doesn't exist, create a new one
      cartItem = await Cart.create({
        img,
        date,
        name,
        price,
        count,
        account_id,
        product_id
      });
    }

    // Fetch updated cart items
    const updatedCart = await Cart.findAll({
      where: { account_id }
    });

    console.log('Updated cart:', updatedCart);

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Error adding to cart' });
  }
};

const getAllCart = async (req, res) => {
  try {
    const cart = await Cart.findAll();
    res.json(cart);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Get cart items by user ID
const getCartItemsByUserId = async (req, res) => {
  try {
    const { id } = req.params; // Thay account_id thành id
    const cartItems = await Cart.findAll({
      where: { account_id : id } // Thay account_id thành id
    });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' });
  }
};
const getCartItemsByAccountId = async (req, res) => {
  try {
    const { account_id } = req.params; // Lấy account_id từ tham số đường dẫn
    const cartItems = await Cart.findAll({
      where: { account_id: account_id } // Sử dụng account_id trong điều kiện where
    });
    res.status(200).json(cartItems); // Trả về danh sách giỏ hàng
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Error fetching cart items' }); // Nếu có lỗi, trả về lỗi
  }
};


// Remove a cart item by ID
const removeFromCart = async (req, res) => {
  try {
    const { cartItemId } = req.params;
    const cartItem = await Cart.findByPk(cartItemId);

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    await cartItem.destroy();
    res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Error removing from cart' });
  }
};
const removeAllFromCart = async (req, res) => {
  try {
    // Xóa toàn bộ các bản ghi trong bảng Cart (payment)
    const result = await Cart.destroy({
      where: {}, // Điều kiện rỗng để xóa toàn bộ bản ghi
      truncate: true // Thêm truncate để xóa và reset auto-increment (nếu có)
    });

    res.status(200).json({ message: 'Đã xóa toàn bộ các sản phẩm khỏi giỏ hàng thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa toàn bộ sản phẩm khỏi giỏ hàng:', error);
    res.status(500).json({ error: 'Lỗi khi xóa toàn bộ sản phẩm khỏi giỏ hàng' });
  }
};



// Update a cart item by ID
const updateCartItem = async (req, res) => {
    try {
      const { cartItemId } = req.params;
      console.log('CartItemId nhận được:', cartItemId); // Kiểm tra giá trị cartItemId
  
      const { count } = req.body;
      let cartItem = await Cart.findByPk(cartItemId);
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      cartItem.count = count;
      await cartItem.save();
      res.status(200).json(cartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Error updating cart item' });
    }
  };
  const transferCartToPayment = async (req, res) => {
    const { account_id, payment_method, payment_status, total_amount, cart_ids } = req.body;
  
    // Kiểm tra dữ liệu đầu vào
    if (!account_id || !payment_method || !payment_status || !total_amount || !Array.isArray(cart_ids) || cart_ids.length === 0) {
      return res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ.' });
    }
  
    try {
      await sequelize.transaction(async (t) => {
        // Loại bỏ các giá trị null hoặc undefined trong cart_ids
        const validCartIds = cart_ids.filter((id) => id != null);
  
        if (validCartIds.length === 0) {
          throw new Error('Dữ liệu giỏ hàng không hợp lệ.');
        }
  
        // Lấy tất cả các sản phẩm trong giỏ hàng theo cart_ids và account_id
        const cartItems = await Cart.findAll({
          where: {
            id: validCartIds,
            account_id: account_id, // Đảm bảo chỉ lấy sản phẩm của tài khoản hiện tại
          },
          transaction: t,
        });
  
        if (!cartItems.length) {
          throw new Error('Không tìm thấy sản phẩm trong giỏ hàng để thanh toán.');
        }
  
        // Tạo một bản ghi thanh toán mới
        const payment = await PaymentOnline.create(
          {
            account_id,
            payment_method,
            payment_status,
            total_amount,
            payment_date: new Date(),
          },
          { transaction: t }
        );
  
        // Lưu các sản phẩm vào bảng History
        const transferPromises = cartItems.map((item) =>
          History.create(
            {
              account_id,
              product_id: item.product_id,
              name: item.name,
              img: item.img,
              price: item.price,
              count: item.count,
              total_price: item.count * item.price,
              order_date: new Date(),
              status: payment_status,
              payment_id: payment.id, // Liên kết với payment
            },
            { transaction: t }
          )
        );
  
        await Promise.all(transferPromises);
  
        // Xóa các sản phẩm trong Cart
        await Cart.destroy({
          where: { id: validCartIds },
          transaction: t,
        });
      });
  
      res.status(200).json({ message: 'Thanh toán thành công và đã chuyển sang lịch sử.' });
    } catch (error) {
      console.error('Lỗi thanh toán:', error.message);
      res.status(500).json({ message: 'Lỗi khi thanh toán', error: error.message });
    }
  };
  
  
module.exports = {
  getAllCart,
  addToCart,
  getCartItemsByUserId,
  removeFromCart,
  updateCartItem,
  removeAllFromCart,
  getCartItemsByAccountId,
  transferCartToPayment
};
