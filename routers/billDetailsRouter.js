const express = require('express');
const router = express.Router();
const billController = require('../controllers/billDetailsController');

router.get('/all', billController.getAllBill)


module.exports = router;