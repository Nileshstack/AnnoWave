import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    //we can veryfy sendrer identity here if needed
    const {username,content}= await request.json();
    try {
        const user = await UserModel.findOne({username});
        if(!user){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found.",
                }),
                {status: 404}
            );
        }
        //is user accepting messages?
        if(!user.isAcceptingMessages){
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User is not accepting messages.",
                }),
                {status: 403}
            );
        } 
        if(!content || content.trim().length===0){
          return new Response(
                JSON.stringify({
                    success: false,
                    message: "Message content cannot be empty.",
                }),
                {status: 403}
            );   
        }
        if(content.trim().length<10){
          return new Response(
                JSON.stringify({
                    success: false,
                    message: "Message content should be at least 10 characters long.",
                }),
                {status: 403}
            );   
        }
        const newMessage = {
            content,
            createdAt: new Date(),
        }
        user.messages.push(newMessage as Message);
        await user.save();
        return new Response(
            JSON.stringify({
                success: true,
                message: "Message sent successfully.",
            }),
            {status: 200}
        ); 
    } catch (error) {
        console.error("Error in send-message route:", error);
        return new Response(
            JSON.stringify({
                success: false,

                message: "Internal Server Error",
            }),
            {status: 500}
        );
    }

}