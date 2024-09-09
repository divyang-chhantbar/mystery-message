import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
// query schema kya hota hai ?
// query schema is used to validate the query parameters in the url and it also helps in type checking the query parameters

// now we will create get request handler which will check if the username is unique or not

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParamas = {
      username: searchParams.get("username"),
    };
    // here we have made an object and haven't take directly the value of username from the searchParams

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParamas);
    // safe parse se kya hoga , agr query params sahi hain to result.success true hoga nahi to false
    console.log(result);
    if(!result.success){
        const usernameErrors = result.error.format().username?._errors || [];
        return Response.json(
            {
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(',') : "Invalid query parameters",
            },
            {
                status: 400,
            }
        );
    }
    const { username } = result.data;

    const existingVerifyUser = await UserModel.findOne({ username , isVerified : true}) 

    if(existingVerifyUser){
        return Response.json(
            {
                success: false,
                message: "Username already exists",
            },
            {
                status: 400,
            }
        );
    }
    return Response.json(
        {
            success: true,
            message: "Username is unique",
        },
        {
            status: 200,
        }
    )
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
