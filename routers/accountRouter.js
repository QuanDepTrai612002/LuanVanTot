const express = require("express");
const router = express.Router();
const AccountController = require("../controllers/accountController");

router.get("/", AccountController.getAllUsers);
router.get("/:id", AccountController.getAccountById);
router.post("/create", AccountController.createAccount);
router.delete("/:id_user", AccountController.deleteUser);
router.put("/:id_user", AccountController.updateUser);
router.post("/login", AccountController.Dangnhap);
router.put("/password/:id", AccountController.updatePassword);

module.exports = router;
