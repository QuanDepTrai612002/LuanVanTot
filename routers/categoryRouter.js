const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categoryController");

router.get("/", CategoryController.getAllCategory);
// router.post("/", AccountController.createAccount);
// router.delete("/:id_user", AccountController.deleteUser);
// router.put("/:id_user", AccountController.updateUser);
// router.post("/login", AccountController.Dangnhap);

module.exports = router;
