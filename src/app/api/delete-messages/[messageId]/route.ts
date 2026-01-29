import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import UserModel from "@/model/User";


//***AftDebug: Next.js 15+: params Promise hote hain, bina await kiye access mat karo

export async function DELETE(request: Request, { params }: { params: Promise<{ messageId: string }> }) {
    const { messageId } = await params;
await dbConnect();
const session= await getServerSession(authOptions);
const user:User=session?.user as User;
if (!session||!session.user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized",
        }),
        { status: 401 }
      );
    }
    try {
        const response= await  UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if(response.modifiedCount===0){
            return new Response(
        JSON.stringify({
          success: false,
          message: "Message not found or could not be deleted.",
        }),
        { status: 404 }
      );
        }

        return new Response(
        JSON.stringify({
          success: true,
          message: "Message deleted successfully.",
        }),
        { status: 200 }
      );
    } catch (error) {
        console.error("Error deleting message:", error);
       return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error",
        }),
        { status: 500 }
      ); 
    }
}
