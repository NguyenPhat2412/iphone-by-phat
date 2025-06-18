require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // This allows cookies to be sent with requests
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Schema User
const clientUser = require("./routes/User");
const clientProduct = require("./routes/Product");
const clientOrder = require("./routes/Order");

app.use("/api/client/user", clientUser);
app.use("/api/client/product", clientProduct);
app.use("/api/client/order", clientOrder);

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
