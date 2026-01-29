import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernamevalidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
    
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("username") || "";

    // Validate using Zod
    const result = UsernameQuerySchema.safeParse({ username: queryParams });

    if (!result.success) {
      const errors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          message: errors[0] || "Invalid username.",
        }),
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken.",
        }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Username is unique",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in check-user-unique route:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error.",
      }),
      { status: 500 }
    );
  }
}
