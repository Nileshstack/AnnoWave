import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

//To get all the username with isvarified true and isaccepting message true
export async function GET(request: Request) {
   try {
    await dbConnect();
    //.lean() is used to return plain js obj insetead of heavy mongoose document.
    const users = await UserModel.find({ isVerified: true, isAcceptingMessages: true}).select("username").sort({ username: 1 }).lean();
    if(!users || users.length==0){
        return new Response(
            JSON.stringify({
                success:false,
                message:"No user Found"
            }),{status:202}
        );
    } 
    //it extract only username and return an array of that. from [{username:"nilesh"}]=>["nilesh"]
    const usernames = users.map(user => user.username);
     return new Response(
      JSON.stringify({
        success: true,
        usernames,
      }),
      { status: 200 }
    );

   } catch (error) {
    return new Response(
        JSON.stringify({
          success: false,
          message: "Internal Server Error in get-username",
        }),
        { status: 500 }
      );
   }
}
