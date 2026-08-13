import mongoose, { Schema, Document } from "mongoose";

export interface RoomDocument extends Document {
  roomName: string;
  roomCode: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  expiresAt: Date;
}

const roomSchema = new Schema<RoomDocument>(
  {
    roomName: {
      type: String,
      required: true,
    },

    roomCode: {
      type: String,
      required: true,
      unique: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // this field will be used to automatically delete messages after a certain time.
    //TTL Index use hota ha
    expiresAt: {
      type: Date,

      // MongoDB auto delete
      index: {
        expires: 0,
      },
    },
  },
  
  { timestamps: true }
);

export default mongoose.models.Room ||
  mongoose.model<RoomDocument>("Room", roomSchema);