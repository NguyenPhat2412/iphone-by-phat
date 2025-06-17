const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { check, validationResult } = require("express-validator");
// const { generateAccessToken } = require("../utils/jwtUtils");
// const { sendEmail } = require("../utils/emailUtils");

// Register a new user
exports.postUser = async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await User.find({ email });
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      fullName,
      phone,
      email,
      password: hashedPassword,
    });
    // Save the user to the database
    await newUser.save();
    // Generate a token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Respond with the user data and token
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
