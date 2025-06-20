const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/Admin");

// Get all products
router.get("/products", adminController.getAllProducts);

// Create a new product
router.post("/new-products", adminController.newProduct);

module.exports = router;
