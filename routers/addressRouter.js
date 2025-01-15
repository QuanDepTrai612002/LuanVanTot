const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/", addressController.getAll);
router.get("/:account_id", addressController.getAddressById);
router.post("/", addressController.createAddress);
router.put("/:id", addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);
router.get("/account", addressController.getAddressesByAccountId);


module.exports = router;