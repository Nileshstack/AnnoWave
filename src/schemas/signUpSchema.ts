import {z} from "zod";
export const usernamevalidation = z.string()
.min(3,{message:"Username must be at least 3 characters long"})
.max(20,{message:"Username must be at most 20 characters long"})
.regex(/^[a-zA-Z0-9_]+$/,{message:"Username can only contain letters, numbers, and underscores"});
// useing direct z.object coz this signUpSchema dosenot have single value
export const signUpSchema = z.object({
 username:usernamevalidation,
 email:z.string()
 .email({message:"Invalid email address"}),
 password:z.string()
 .min(6,{message:"Password must be at least 6 characters long"})
 .max(30,{message:"Password must be at most 30 characters long"})
});