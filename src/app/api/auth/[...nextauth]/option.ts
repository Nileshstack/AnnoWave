import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { jwt } from "zod";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
  identifier: { label: "Email or Username", type: "text" },
  password: { label: "Password", type: "password" },
},
        async authorize(credentials:any, req): Promise<any> {
            await dbConnect();
            try {
                  const user = await UserModel.findOne({
                    $or: [
                        { username: credentials.identifier },
                        { email: credentials.identifier },
                    ],
                    });
                if(!user){
                    throw new Error("Invalid username or password");
                }
                if(!user.isVerified){
                    throw new Error("Please verify your email to login");
                }
               const isPasswordCorrect=await bcrypt.compare(credentials.password,user.password);
               if(!isPasswordCorrect){
                throw new Error("Invalid username or password");
               }else{
                return user;
               }
            } catch (error:any) {
               throw new Error(error.message); 
            }
        }
})
],
callbacks:{
    async session({session,token}){
      if(token){
        session.user._id=token._id as string;
        session.user.username=token.username as string;
        session.user.isVerified=token.isVerified as boolean;
        session.user.isAcceptingMessages=token.isAcceptingMessages as boolean;
      }
      return session
    },
    async jwt({token,user}){
        if(user){
            token._id=user._id?.toString();
            token.username=user.username;
            token.isVerified=user.isVerified;
            token.isAcceptingMessages=user.isAcceptingMessages;
        }
        return token;
    }
},
pages:{
    signIn:"/sign-in"
},session:{
    strategy:"jwt"
},
secret:process.env.NextAUTH_SECRET
};