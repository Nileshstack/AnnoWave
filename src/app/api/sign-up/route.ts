import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ApiReasponse } from "@/types/ApiResponse";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username,email,password}=await request.json();
        //send username if isverified is true
        const existingUserVerifiedByusername= await UserModel.findOne(
            {username,isVerified:true});
            //checking weather username is already taken
        if(existingUserVerifiedByusername){
            return NextResponse.json({
                success:false,
                message:"Username is already taken."
            },{status:400});
        }
        const existingUserVerifiedByEmail= await UserModel.findOne
        ({email, isVerified:true});
        //email already registered
        if(existingUserVerifiedByEmail){
        if(existingUserVerifiedByEmail.isVerified){
            return NextResponse.json({
                success:false,
                message:"Email is already registered."
            },{status:400});
        }
        else{
            //user exists but not verified ,resend verification email
            const hashedPassword= await bcrypt.hash(password,10);
            existingUserVerifiedByEmail.password=hashedPassword;
            existingUserVerifiedByEmail.verifyCode=Math.floor(100000 + Math.random() * 900000).toString();
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);
            await existingUserVerifiedByEmail.save();
        }
        }else{
            const hashedPassword= await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours()+1);//1 hour expiry
            const newUser=new UserModel({
                username,
                 email,
                 password:hashedPassword,
                 verifyCode:Math.floor(100000 + Math.random() * 900000).toString(),
                 verifyCodeExpiry: expiryDate,
                 isVerified:false,
                 isAcceptingMessages:true,
                 messages:[]
                 
            });
            await newUser.save();
            //send verification email
            const emailResponse:ApiReasponse=await sendVerificationEmail(
                email,
                username,
                newUser.verifyCode
            );
            if(!emailResponse.success){
                return NextResponse.json({
                    success:false,
                    message:emailResponse.message
                },{status:500});
            }
            return NextResponse.json({
                    success:true,
                    message:"User registered successfully. Verification email sent."
                },{status:201});
        }

    } catch (error) {
        console.error("Error in sign-up route:", error);
        return NextResponse.json({
            success: false,
            error:error,
            message: "Internal server error."
        }, { status: 500 });
    }
}