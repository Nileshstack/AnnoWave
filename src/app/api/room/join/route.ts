import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/model/Room";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userId = session.user._id;

    const body = await req.json();
    const { roomCode } = body;

    if (!roomCode?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Room code is required",
        },
        { status: 400 }
      );
    }

    // Find room
    const room = await Room.findOne({
      roomCode: roomCode.trim(),
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

    // Check if user is already a member
    const alreadyMember = room.members.some( (member: any) => member.toString() === userId );

    // Add only if not already present
    if (!alreadyMember) {
      room.members.push(userId);
      await room.save();
    }

    return NextResponse.json(
      {
        success: true,
        alreadyMember,
        message: alreadyMember
          ? "Welcome back! Redirecting to the room..."
          : "Joined room successfully",
        room,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}