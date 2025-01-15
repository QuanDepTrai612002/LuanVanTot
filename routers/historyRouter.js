const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/",historyController.getAll);
router.get("/:account_id",historyController.getHistoryById  );
// router.post("/", historyController.createAddress);
// router.put("/:id", historyController.updateAddress);
// router.delete("/:id", historyController.deleteAddress);
// router.get("/account", addressController.getAddressesByAccountId);


module.exports = router;