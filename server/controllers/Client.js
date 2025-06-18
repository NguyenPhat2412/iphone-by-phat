const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Footer = require("../models/Footer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { check, validationResult } = require("express-validator");
// const { generateAccessToken } = require("../utils/jwtUtils");
// const { sendEmail } = require("../utils/emailUtils");

const { sendOrderConfirmationEmail } = require("../utils/emailService");

// Register a new user
exports.postUser = async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Validate input
  if (!name || !phone || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    phone,
    email,
    password: hashedPassword,
  });

  newUser
    .save()
    .then(() => {
      res.status(201).json({
        message: "User registered successfully",
      });
    })
    .catch((err) => {
      console.error("Error registering user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};

// Get all user data
exports.getUser = async (req, res) => {
  const { email, password } = req.body;

  // validate email and password
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  console.log("Generated JWT token:", token);

  // Post Cookie
  res.cookie("tokenbe", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // // Find user by email and password
  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       return res.status(404).json({ error: "User not found" });
  //     }

  //     // // Generate JWT token
  //     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //     //   expiresIn: "1h",
  //     // });

  //     res.status(200).json({
  //       message: "User logged in successfully",
  //       // token,
  //       user: {
  //         id: user._id,
  //         fullName: user.fullName,
  //         email: user.email,
  //         phone: user.phone,
  //         role: user.role,
  //       },
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("Error fetching user data:", err);
  //     res.status(500).json({ error: "Internal server error" });
  //   });
  return res.status(200).json({
    message: "User logged in successfully",
    // token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
};

// Get products
exports.getAllProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) {
    return res.status(404).json({ error: "Products not found" });
  }
  res.status(200).json(products);
};

// Order a product
exports.postOrder = async (req, res) => {
  try {
    const { customer, cart, totalPrice } = req.body;

    // Validate input
    if (!customer || !cart || !totalPrice) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Create a new order
    const newOrder = new Order({
      customer,
      cart,
      totalPrice,
      status: "Pending",
    });
    const saveOrder = await newOrder.save();

    // gửi email xác nhận đơn hàng
    await sendOrderConfirmationEmail(
      customer.email,
      customer.name,
      customer.phone,
      customer.address,
      cart,
      saveOrder.createdAt
    );
    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  // Clear the cookie
  res.clearCookie("tokenbe", token, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    path: "/",
  });
  res.status(200).json({ message: "User logged out successfully" });
};

// Get all data footer
exports.getAllFooter = async (req, res) => {
  Footer.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error("Error fetching footer data:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};
