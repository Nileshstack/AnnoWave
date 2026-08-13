const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const Room = require("./models/Room");
const RoomMessage = require("./models/RoomMessage");

const app = express();

app.use(cors());

connectDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {

  socket.on("join-room", (roomCode) => {
    socket.join(roomCode);
  });

  socket.on("send-message", async (data) => {
    try {

      const room = await Room.findOne({
        roomCode: data.roomCode,
      });

      if (!room) {
        return;
      }

      const savedMessage = await RoomMessage.create({
        roomId: room._id,
        senderId: data.senderId,
        message: data.message,
        expiresAt: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      });

      io.to(data.roomCode).emit(
        "receive-message",
        savedMessage
      );

    } catch (err) {
      console.log("Message Error:", err);
    }
  });

  socket.on("leave-room", (roomCode) => {
    socket.leave(roomCode);
  });

});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket Server Running on port ${PORT}`);
});