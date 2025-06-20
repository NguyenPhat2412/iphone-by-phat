const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/Admin");

// Get all users
router.get("/users", adminController.getAllUser);

module.exports = router;
