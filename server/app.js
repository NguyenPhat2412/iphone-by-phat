const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Schema User
const clientUser = require("./routes/User");
const clientProduct = require("./routes/Product");

app.use("/api/client/user", clientUser);
app.use("/api/client/product", clientProduct);

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
