import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import RoomMessage from "@/model/RoomMessage";
import Room from "@/model/Room";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {

    await dbConnect();

    const { roomId } = await params;

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

    const messages = await RoomMessage.find({
      roomId: room._id,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      success: true,
      messages,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );

  }
}