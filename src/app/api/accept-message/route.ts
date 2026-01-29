import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth"
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
    const session = await getServerSession(authOptions);
    const user= session?.user as User;
    if (!session||!session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );
    }
    const userId = user._id;
   const { isAcceptingMessages } = await request.json();
    try {
       const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { isAcceptingMessages },
        { new: true }
      );
      if(!updatedUser){
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found.",
          }),
          { status: 401 }
        );
      }
        return new Response(
        JSON.stringify({
          success: true,
          message: "acceptMessage updated successfully",
            data: updatedUser,
        }),
        { status: 200 }
    );
    } catch (error) {
        console.error("Error updating acceptMessage:", error);
        return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
        }),
        { status: 500 }
      );
        
    }
}

export async function GET(request: Request) {
  await dbConnect();
    const session = await getServerSession(authOptions);
    const user= session?.user as User;
    if (!session||!session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );
    }
    const userId = user._id;
    try {
        const foundUser= await UserModel.findById(userId);
    if(!foundUser){
        return new Response(
          JSON.stringify({
            success: false,
            message: "User not found.",
          }),
          { status: 401 }
        );
      }
    return new Response(
        JSON.stringify({
          success: true,
          message: "acceptMessage fetched successfully",
          isAcceptingMessages: foundUser.isAcceptingMessages,
        }),
        { status: 200 }
      );
    } catch (error) {
        console.error("Error fetching acceptMessage:", error);
        return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
        }),
        { status: 500 }
      );
        
    }
}