const express = require('express');
const PaymentOrderController = require('../controllers/paymentsOrderController');
const router = express.Router();

router.get('/all', PaymentOrderController.getPayments); 
router.post('/add', PaymentOrderController.createPayment);  

module.exports = router; 