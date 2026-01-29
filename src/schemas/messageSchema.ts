import {z} from "zod";

export const messageSchema=z.object({
   content:z.string().
min(10,{message:"Message content cannot be empty at least of 10 characters"})
.max(300,{message:"Message content cannot exceed 300 characters"})
});