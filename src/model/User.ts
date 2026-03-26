import mongoose,{Schema, Document} from "mongoose";
import { boolean } from "zod";

export interface Message extends Document{
 content:string;
 createdAt:Date;
  like:boolean;
}
const MessageSchema:Schema<Message> = new Schema({
  content:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    required:true,
    default:Date.now
  },
  like:{
    type:Boolean,
    default:false
  }
})

export interface User extends Document{
 username:string;
 email:string;
 password:string;
 verifyCode:string;
 verifyCodeExpiry:Date;
 isVerified:boolean;
 isAcceptingMessages:boolean;
 messages:Message[];
}
const UserSchema:Schema<User> = new Schema({
  username:{
    type:String,
    required:[true,"Username is required"],
    trim:true,
    unique:true
  },
    email:{
    type:String,
    required:[true,"Email is required"],
    trim:true,
    match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"Please fill a valid email address"],
  },
    password:{
    type:String,
    required:[true,"Password is required"],

 },
    verifyCode:{
    type:String,
    required:[true,"Verification code is required"]
},
    isVerified:{
    type:Boolean,
    default:false
    },
    verifyCodeExpiry:{
    type:Date,
    required:[true,"Verification code expiry is required"]
    },
    isAcceptingMessages:{
    type:Boolean,
    default:true
    },
    messages:[MessageSchema]
});
const UserModel =(mongoose.models.User as mongoose.Model<User>)//this part is for when database ha already model defined not created first time. 
|| mongoose.model<User>("User",UserSchema);
export default UserModel;