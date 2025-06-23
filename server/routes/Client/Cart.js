const express = require("express");
const router = express.Router();
const CartController = require("../../controllers/Client");

// post cart
router.post("/cart", CartController.postCart);

// get cart by userId
router.get("/cart/:userId", CartController.getCartByUserId);

module.exports = router;
