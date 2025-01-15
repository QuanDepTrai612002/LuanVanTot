const express = require('express');
const router = express.Router();
const billmainController = require('../controllers/billmainController');

router.post('/add', billmainController.createBill);
router.get('/all', billmainController.getAllBill);
router.get('/alldate', billmainController.getAllBillDate);


module.exports = router;