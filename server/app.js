require("dotenv").config();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(bodyParser.json());
// Connect to MongoDB
app.use((req, res, next) => {
  res
    .status(404)
    .send(
      "<h1>Page Not Found</h1>" +
        "<p>Sorry, the page you are looking for does not exist.</p>"
    );
});

const room = {};

io.on("connection", (socket) => {
  // when client send a message
  socket.on("client_message", ({ roomId, message }) => {
    console.log("Received message from client:", message);
    if (message === "/end") {
      delete room[roomId];
      socket.leave(roomId);
      io.to(roomId).emit("chat_ended");
      return;
    }

    // If the room does not exist, create it
    if (!roomId || !room[roomId]) {
      roomId = `room_${Date.now()}`;
      room[roomId] = { messages: [], clientId: socket.id };
      socket.emit("room_created", { roomId });
    }

    room[roomId].messages.push({ sender: "client", message, roomId });
    socket.join(roomId);
    io.to(roomId).emit("new_message", { sender: "client", message, roomId });

    // Send message from client to frontend
    console.log(`[SERVER] Client gửi message tới room ${roomId}: ${message}`);

    // Phản hồi từ bot (giả lập)
    const botResponse = `Bot: Chào bạn, tôi là bot. Bạn đã gửi: ${message}. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.`;
    room[roomId].messages.push({ sender: "bot", message: botResponse });
    setTimeout(() => {
      io.to(roomId).emit("new_message", {
        sender: "bot",
        message: botResponse,
        roomId,
      });
    }, 1000);
  });

  //  when admin send a message
  socket.on("admin_message", ({ roomId, message }) => {
    if (!room[roomId]) return;
    room[roomId].messages.push({ sender: "admin", message });
    io.to(roomId).emit("new_message", { sender: "admin", message, roomId });
  });

  // Admin get list of rooms
  socket.on("get_rooms", () => {
    const roomList = Object.keys(room);
    socket.emit("rooms_list", roomList);
  });

  // Join room
  socket.on("join_room", ({ roomId }) => {
    console.log(`Socket ${socket.id} joined room ${roomId}`);
    socket.join(roomId);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT || 5000, () => {
      console.log("server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
