const mongoose = require("mongoose");

const RoomMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.RoomMessage ||
  mongoose.model("RoomMessage", RoomMessageSchema);