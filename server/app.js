require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Schema User
const clientUser = require("./routes/Client/User");
const clientProduct = require("./routes/Client/Product");
const clientOrder = require("./routes/Client/Order");

// Admin
const adminUser = require("./routes/Admin/User");
const adminProduct = require("./routes/Admin/Product");
const adminUpload = require("./routes/Admin/Upload");
// Client Routes
app.use("/api/client/user", clientUser);
app.use("/api/client/product", clientProduct);
app.use("/api/client/order", clientOrder);

// Admin Routes
app.use("/api/admin/user", adminUser);
app.use("/api/admin/product", adminProduct);
app.use("/api/admin/upload", adminUpload);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
app.use((req, res, next) => {
  res
    .status(404)
    .send(
      "<h1>Page Not Found</h1>" +
        "<p>Sorry, the page you are looking for does not exist.</p>"
    );
});

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://nguyenphat2412:phatdeptrai123@nodejsudemy.hdztbvu.mongodb.net/assignment3?retryWrites=true&w=majority&appName=nodejsudemy"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log("server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
