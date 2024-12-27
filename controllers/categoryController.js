const Category = require("../models/categoryModel");

// Lấy tất cả sản phẩm
exports.getAllCategory = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.json(category);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// exports.getProductById = async (req, res) => {
//     const { id } = req.params;
  
//     try {
//       const products = await Products.findByPk(id);
  
//       if (!products) {
//         return res.status(404).send("Product not found");
//       }
  
//       res.status(200).json(products);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   };
//   exports.getProductByCategory = async (req, res) => {
//     const { category_id } = req.body;

//     // Chỉ kiểm tra undefined hoặc null
//     if (category_id === undefined || category_id === null) {
//         return res.status(400).json({ message: "Thiếu category_id trong yêu cầu" });
//     }

//     try {
//         const products = await Products.getProductsByCategory(category_id);

//         if (!products || products.length === 0) {
//             return res.status(404).json({ message: `Không có sản phẩm nào cho category_id = ${category_id}` });
//         }

//         res.status(200).json(products);
//     } catch (err) {
//         console.error("Lỗi khi lấy sản phẩm theo danh mục:", err.message);
//         res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo danh mục", error: err.message });
//     }
// };

// // Tạo sản phẩm mới
// exports.createProduct = async (req, res) => {
//   try {
//     const requiredFields = [
//       "name",
//       "price",
//       "img",
//       "description",
//       "hot",
//       "category_id"
//     ];

//     const missingFields = requiredFields.filter(field => !req.body[field]);

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: "All fields are required",
//         missingFields: missingFields
//       });
//     }

//     if (req.body.id) {
//       return res.status(400).json({
//         error: "Khong can them id vao"
//       });
//     }

//     if (Array.isArray(req.body)) {
//       const createProduct = await Products.bulkCreate(req.body);
//       res.status(201).json(createProduct);
//     } else {
//       const product = await Products.create(req.body);
//       res.status(201).json(product);
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// // Xóa sp
// exports.deleteProducts = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const products = await Products.findByPk(id);

//     if (!products) {
//       return res.status(404).send("That bai");
//     }
//     await products.destroy();
//     res.status(200).send("Xoa san pham thanh cong");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// // Cập nhật người dùng
// exports.updateProduct = async (req, res) => {
//   const { id } = req.params;
//   const {
//      name,
//      price,
//      img,
//      description,
//      hot,
//      category_id
//   } = req.body;

//   try {
//     const product = await Products.findByPk(id);

//     if (!product) {
//       return res.status(404).send("Product not found");
//     }

//     // Cập nhật thuộc tính sản phẩm với giá trị mới nếu có, nếu không giữ nguyên giá trị cũ
//     product.name = name !== undefined ? name : product.name;
//     product.price = price !== undefined ? price : product.price;
//     product.img = img !== undefined ? img : product.img;
//     product.description = description !== undefined ? description : product.description;
//     product.product_hot = hot !== undefined ? hot : product.product_hot;
//     product.category_id = category_id !== undefined ? category_id : product.category_id;

//     await product.save();
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };