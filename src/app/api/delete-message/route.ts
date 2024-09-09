import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
export async function DELETE(request : Request , {params}:{params: {messageid:string}}) {
    const messageid = params.messageid;
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

    try {
       const updateResult = await UserModel.updateOne(
            {
                _id : user._id
            },
           {$pull: {messages: {_id: messageid}}}  
        )
        if(updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found"
                },
                {
                    status: 404
                }
            )
        }
        return Response.json(
            {
                success: true,
                message: "Message deleted successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("An unexpected error occur in deleting", error)
        return Response.json(
            {
                success: false,
                message: "Error deleting message"
            },
            {
                status: 500
            }
        )
    }
}