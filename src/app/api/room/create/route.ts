import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/model/Room";
import User from "@/model/User";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const { roomName, members, createdBy } = body;

    // members => usernames array

    if (!roomName || !members?.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Room name and members required",
        },
        { status: 400 }
      );
    }

    // Database se wo saare users nikalne ke liye jinke username members list me diye gaye hain.

    const users = await User.find({
      username: { $in: members },
    });

    if (!users.length) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid users found",
        },
        { status: 404 }
      );
    }

    // Generate unique room code

    const roomCode = nanoid(8);
    
    //expiresAt => 36 hours from now
    const expiresAt = new Date(
  Date.now() + 36 * 60 * 60 * 1000
);
    // Create room
    
    const room = await Room.create({
      roomName,
      roomCode,
      createdBy,
      members: users.map((u) => u._id),
      expiresAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully",
        room,
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