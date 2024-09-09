import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

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
    // const userId = user._id;
    // here the user is coming from the session we have in the strings and its a classic mistake when you are finding and we could get errors while doing this and normally it get handled  by findById method but when you are using aggregation pipelines you need to handle it manually . So we will use the below code to handle it
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match : {id:userId}}, 
            // here we are using the match to match the user id .
            {$unwind: "$messages"},
            // here we are using the unwind to unwind the messages array 
            {$sort: {"messages.createdAt": -1}},
            {$group: {_id : '$_id', messages : {$push: '$messages'}}}
        ])
        if(!user || user.length === 0) {
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
                messages : user[0].messages
            }
        )
    } catch (error) {
        console.log("An unexpected error occur in getting",error)
        return Response.json(
            {
                success: false,
                message: "Not Authorized"
            },
            {
                status: 500
            }
        )
    }

}