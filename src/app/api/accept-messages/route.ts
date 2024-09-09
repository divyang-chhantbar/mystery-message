import { getServerSession } from "next-auth";
// getServerSession is a function that returns the session object if the user is authenticated, otherwise it returns null
import { authOptions } from "../auth/[...nextauth]/option";
// we need an authOptions because in that we have credentialProvider which is used to get the user's credentials
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {User} from "next-auth";

// we will create a post request so the current logged in user can flip the acceptMessage flag

export async function POST(request : Request) {
    await dbConnect();

    // the first thing we need a current logged in user so 
    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !session.user) {
       return Response.json(
        {
            success: false,
            message: "You are not authenticated"
        },
        {
            status: 401
        }
       )
}   
    const userId = user._id;
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessage},
            {new : true} // return jo milega wo updated document hoga
        )
// ab iske baad check krlijiye ki user update hua ya nahi

        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "User status updated successfully",
                updatedUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Failed to update user status to accept messages", error);
        
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept messages"
            },
            {
                status: 500
            }
        )
    }
    
}

export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user

    if(!session || !session.user) {
       return Response.json(
        {
            success: false,
            message: "You are not authenticated"
        },
        {
            status: 401
        }
       )
    }
    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
    
        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessage: foundUser.isAcceptingMessage,
                user: foundUser
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.error("Failed to get user status to accept messages", error);
        
        return Response.json(
            {
                success: false,
                message: "Failed to get user status to accept messages"
            },
            {
                status: 500
            }
        )
        
    }
}