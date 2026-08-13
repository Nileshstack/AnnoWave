import mongoose, { Schema, Document } from "mongoose";

export interface RoomMessageDocument extends Document {
  roomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  message: string;
  expiresAt: Date;
}

const roomMessageSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },

    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    message: {
      type: String,
      required: true,
    },

    // this field will be used to automatically delete messages after a certain time.
    //TTL Index use hota hai
    expiresAt: {
      type: Date,

      // MongoDB auto delete
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.RoomMessage ||
  mongoose.model("RoomMessage", roomMessageSchema);