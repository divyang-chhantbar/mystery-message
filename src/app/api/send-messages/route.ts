import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(request : Request) {
    await dbConnect();

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {success : false , 
                message : "User not found !"
            },
            {status : 404}
            )
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success : false , 
                message : "User is not accepting message !"
            },
            {status : 403}
            )
        }

        const newMessage = {content , createdAt : new Date()}
        // how can we know that now we have to push the newMessage to the user.message array
        // because we have to know the type of user.message array
        // we have to cast the newMessage to Message type because the type of user.message is Message[]
        user.message.push(newMessage as Message);
        await user.save();
        return Response.json(
            {
                success : true,
                message : "Message Sent !"
            },
            {status : 200}
        )
    } catch (error) {
        console.log("An unexpected error occur in sending",error)
        return Response.json(
            {
                success : false,
                message : "Not Authorized"
            },
            {status : 401}
        )
    }
}