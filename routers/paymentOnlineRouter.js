const express = require('express');
const PaymentOnlineController = require('../controllers/paymentOnlineController');
const router = express.Router();

router.get('/all', PaymentOnlineController.getAllPayment); 
router.get('/account/:account_id', PaymentOnlineController.getPaymentAccount); 
router.put('/status/:id', PaymentOnlineController.updateStatus); 


module.exports = router; 