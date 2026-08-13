const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    roomName: String,

    roomCode: {
      type: String,
      unique: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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
  mongoose.models.Room ||
  mongoose.model("Room", RoomSchema);