
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/model/Room";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";
import { getServerSession } from "next-auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    // Not logged in
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { roomId: roomCode } = await params;
    const userId = (session.user as any)._id;

    const room = await Room.findOne({
  roomCode,
});

    if (!room) {
      return NextResponse.json(
        { success: false, message: "Room not found" },
        { status: 404 }
      );
    }

    // Check if userId exists in members array
    const isMember = room.members.some(
      (member: any) => member.toString() === userId
    );

    if (!isMember) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}