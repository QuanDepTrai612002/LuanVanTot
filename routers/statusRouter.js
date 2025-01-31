const express = require('express');
const statusController = require('../controllers/statusController'); // Đảm bảo import đúng controller
const router = express.Router();

router.put("/updateStatus", statusController.updateOrderStatus);  
router.get('/all', statusController.getAllStatus); 
router.post('/trangthai', statusController.getStatusKitchen);
router.post('/table', statusController.getStatusByTable);
router.post('/statusId/:account_id', statusController.getOrderStatusByAccountId);  
router.post("/add", statusController.addOrderStatusFromCartOrder);
router.post("/transfer", statusController.transferStatusToBill);
router.delete("/remove/:id", statusController.deleteStatus);


module.exports = router;    
