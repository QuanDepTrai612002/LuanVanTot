const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add to Cart
router.post('/add-to-cart', cartController.addToCart);
router.get('/all', cartController.getAllCart)
router.get('/account/:account_id', cartController.getCartItemsByAccountId)

// Get Cart Items by User ID
router.get('/cart/:id', cartController.getCartItemsByUserId);
// Remove from Cart
router.delete('/:cartItemId', cartController.removeFromCart);
router.delete('/delete', cartController.removeAllFromCart);
// Update Cart Item
router.put('/update-cart-item/:cartItemId', cartController.updateCartItem);
//Chuyen du lieu
// router.post("/transfer", cartController.transferCartToHistory);
router.post("/transfer", cartController.transferCartToPayment);


module.exports = router;
