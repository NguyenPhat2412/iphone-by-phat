const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/Admin");

// Get all products
router.get("/products", adminController.getAllProducts);

// Create a new product
router.post("/new-products", adminController.newProduct);

// edit product
router.put("/edit-product/:id", adminController.editProduct);

// Get product by ID
router.get("/product-id/:id", adminController.getProductById);

// Delete product
router.delete("/delete-product/:id", adminController.deleteProduct);

module.exports = router;
