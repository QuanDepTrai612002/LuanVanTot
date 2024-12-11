const express = require('express');
const router = express.Router();
const billmainController = require('../controllers/billmainController');

router.post('/add', billmainController.createBill)


module.exports = router;