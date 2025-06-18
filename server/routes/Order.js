const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/Client");

// Create a new order
router.post("/orders", OrderController.postOrder);

module.exports = router;
