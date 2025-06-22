const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
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

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register admin
exports.registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error registering admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Error logging in admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get number of clients
exports.getNumberOfClients = async (req, res) => {
  try {
    const numberClient = await User.countDocuments({ role: "user" });
    res.status(200).json({ numberClient });
  } catch (err) {
    console.error("Error fetching number of clients:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get number of orders
exports.getNumberOfOrders = async (req, res) => {
  try {
    const numberOrder = await Order.countDocuments();
    res.status(200).json({ numberOrder });
  } catch (err) {
    console.error("Error fetching number of orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get number of earnings
exports.getNumberOfEarnings = async (req, res) => {
  try {
    const orders = await Order.find();
    const numberEarning = orders.reduce((acc, orders) => {
      return acc + orders.totalPrice;
    }, 0);
    res.status(200).json({ numberEarning });
  } catch (err) {
    console.error("Error fetching number of earnings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
