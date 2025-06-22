const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/Admin");

// Get all users
router.get("/users", adminController.getAllUser);

// Register a new user
router.post("/register", adminController.registerAdmin);

// Login user
router.post("/login", adminController.loginAdmin);

// delete user by id
router.delete("/users/:id", adminController.deleteUser);

// get number of clients
router.get("/number-client", adminController.getNumberOfClients);

// get number of orders
router.get("/number-order", adminController.getNumberOfOrders);

// get number of earnings
router.get("/number-earning", adminController.getNumberOfEarnings);

// get all orders
router.get("/orders", adminController.getAllOrders);

module.exports = router;
