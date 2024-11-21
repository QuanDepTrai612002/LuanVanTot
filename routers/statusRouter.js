const express = require('express');
const statusController = require('../controllers/statusController'); // Đảm bảo import đúng controller
const router = express.Router();

router.put("/updateStatus", statusController.updateOrderStatus);  
router.get('/all', statusController.getAllStatus); 
router.post('/statusId/:account_id', statusController.getOrderStatusByAccountId);  
router.post("/add", statusController.addOrderStatusFromCartOrder);


module.exports = router;    
