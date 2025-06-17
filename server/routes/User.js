const path = require("path");
const express = require("express");
const router = express.Router();

const clientController = require("../controllers/Client");

// register user
router.post("/register", clientController.postUser);

module.exports = router;
