import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2,"Username must have atleast 2 characters")
    .max(10 , "Username should be less than 10 characters")
    .regex(/^[a-zA-Z0-9]+$/ , "Username must not contain any special characters")

export const signUpSchema = z.object({
    username : usernameValidation,
    email : z.string().email({message:'Invalid email address'}),
    password : z.string().min(8,{message:'password must contain 8 characters'})
})