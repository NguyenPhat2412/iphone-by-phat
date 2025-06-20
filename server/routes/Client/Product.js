const path = require("path");
const express = require("express");
const router = express.Router();

const clientController = require("../../controllers/Client");

// get all products
router.get("/products", clientController.getAllProducts);

module.exports = router;
