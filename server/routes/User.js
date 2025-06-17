const path = require("path");
const express = require("express");
const router = express.Router();

const clientController = require("../controllers/Client");

// register user
router.post("/register", clientController.postUser);

// login user
router.post("/login", clientController.getUser);

// get all footer data
router.get("/footer", clientController.getAllFooter);

module.exports = router;
