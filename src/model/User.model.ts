import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document {
    _id: string;
    content : string,
    createdAt : Date
}

const MessageSchema:Schema<Message> = new Schema({
    content: {
        type:String,
        required:true,
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now
    }
})

export interface User extends Document{
    _id : string;
    username : string,
    email : string , 
    password : string,
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessage : boolean,
    message : Message[]
}

const UserSchema:Schema<User> = new Schema({
    username : {
        type : String , 
        required : [true , "Username is Required !"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required  : [true , "Email is Required !"],
        unique : true,
        match : [/^\S+@\S+\.\S+$/,"please provide a valid email address !"]
    },
    password : {
        type : String,
        required : [true,"Password is required !"]
    },
    verifyCode : {
        type : String,
        required : [true,"Verify Code is required !"],
    },
    verifyCodeExpiry : {
        type: Date,
        required : [true , "Verify Code Expiry is required !"]
    },
    isVerified : {
        type: Boolean,
        default : false,
    },
    isAcceptingMessage : {
        type: Boolean,
        default : true,
    },
    message : [MessageSchema]
})

 const UserModel = (mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema))
 export default UserModel;