const path = require("path");
const express = require("express");
const router = express.Router();

const clientController = require("../controllers/Client");
const authController = require("../controllers/authController");
// register user
router.post("/register", clientController.postUser);

// login user
router.post("/login", clientController.getUser);

// logout user
router.get("/logout", clientController.logoutUser);

// get all footer data
router.get("/footer", clientController.getAllFooter);

// check if user is authenticated
router.get("/check-auth", authController.checkAuth);
module.exports = router;
