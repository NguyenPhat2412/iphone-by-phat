const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// get all User
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// new product
exports.newProduct = async (req, res) => {
  const { name, category, short_desc, long_desc, images, price } = req.body;

  console.log("Received files:", images);
  if (
    (!name || !category || !short_desc || !long_desc || images.length === 0,
    !price)
  ) {
    return res.status(400).json({
      error: "All fields are required",
      name,
      category,
      short_desc,
      long_desc,
      price,
      image: images,
    });
  }

  try {
    const newProduct = new Product({
      name,
      category,
      short_desc,
      long_desc,
      price,
      image: images,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, long_desc, short_desc, price } = req.body;
  const editProduct = await Product.findByIdAndUpdate(id);
  if (!editProduct) {
    return res.status(404).json({ error: "Product not found" });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, long_desc, short_desc, price },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
