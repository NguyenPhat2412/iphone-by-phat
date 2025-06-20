const express = require("express");
const router = express.Router();
const OrderController = require("../../controllers/Client");

// Create a new order
router.post("/orders", OrderController.postOrder);

// Get orders by user ID
router.get("/:userId", OrderController.getOrderByUserId);

// Get order by order ID
router.get("/view-orders/:orderId", OrderController.getOrderById);

module.exports = router;
