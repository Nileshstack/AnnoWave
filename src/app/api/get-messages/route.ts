import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import {User} from "next-auth"
import UserModel from "@/model/User";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
              { $match: { _id: userId } },

              {
                $unwind: {
                  path: "$messages",
                  preserveNullAndEmptyArrays: true,
                },
              },

              { $sort: { "messages.createdAt": -1 } },

              {
                $group: {
                  _id: "$_id",
                  messages: { $push: "$messages" },
                },
              },
            ]);
            const messages = (user[0]?.messages || []).filter(Boolean);
        if(!user||user.length===0){
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
            messages:messages,
        }),
        { status: 200 }
    );
    } catch (error) {
        return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
        }),
        { status: 500 }
      );
    }
}