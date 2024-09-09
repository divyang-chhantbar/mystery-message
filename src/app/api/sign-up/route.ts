import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect()
    try {
         const {username,email,password}= await request.json()
         const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
         })

         if(existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : "Username is already taken"
            } , 
            {
                status : 400
            })
         }

         const existingUserByEmail = await UserModel.findOne({email})

         const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

         if(existingUserByEmail){
            if(existingUserByEmail.isVerified)
           { return Response.json({
                success : false,
                message : "User is already registered"
            }, {
                status : 400
            })}
            else{
                const hashedPasswrod = await bcrypt.hash(password,10)
                // now we will overwrite the password 
                existingUserByEmail.password = hashedPasswrod;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()                
            }
         }
         else{
            const hashedPasswrod = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email , 
                password : hashedPasswrod,
                verifyCode : verifyCode,
                verifyCodeExpiry : expiryDate,
                isVerified : false,
                isAcceptingMessage : true,
                message :[]
            })

            await newUser.save()
         }

         // send verification email

         const emailResponse = await sendVerificationEmail(email , username ,verifyCode)

         if(!emailResponse.success) {
            return Response.json({
                success : false,
                message : emailResponse.message
            }, {
                status : 500
            })
         }

         return Response.json({
            success : true,
            message : "User Registered Successfully . Please Verify your email !"
        }, {
            status : 201
        })

    } catch (error) {
        console.error('Error registering email',error);
        return Response.json({
            success : false,
            message : "Error registering email"
        },{
            status :500
        })
        
    }
}