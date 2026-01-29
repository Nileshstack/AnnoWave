import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURI(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found.",
        }),
        { status: 404 }
      );
    }

    // Check verification code
    const isCodeValid = user.verifyCode === code;

    //Check expiry
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "User verified successfully.",
        }),
        { status: 200 }
      );
    }

    //Expired code
    if (!isCodeNotExpired) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Verification code has expired.",
        }),
        { status: 400 }
      );
    }

    //Invalid code
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid verification code.",
      }),
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in verify-code route:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "verify user error.",
      }),
      { status: 500 }
    );
  }
}
