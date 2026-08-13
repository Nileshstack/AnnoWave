import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RoomMessage from "@/model/RoomMessage";
import Room from "@/model/Room";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const { roomId, message, senderId } = body;

    if (!roomId || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields required",
        },
        { status: 400 }
      );
    }

    // Check room exists
    
   const room = await Room.findOne({
    roomCode: roomId,
});

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
        },
        { status: 404 }
      );
    }

    // Save anonymous message

  const expiresAt = new Date(
  Date.now() + 24 * 60 * 60 * 1000
);

const newMessage = await RoomMessage.create({
  roomId: room._id, 
  senderId,
  message,
  expiresAt,
});

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}