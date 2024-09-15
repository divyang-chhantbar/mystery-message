## FullStack APP with NextJs

### Mastering ZOD !

ZOD is a library which gives a lot of schemas , making it easier to validate and parse data. It integrates seamlessly with NextJs, ensuring that your data structures are reliable and type-safe. By using ZOD, you can prevent many common errors related to data validation.

we know NextJs is a edge time framework (it means it will not work continuously and will respond according to the request come ! ) and have **stateless architecture**

kehne ka bhavarth ye he ki hume ye dhyan rakhna padega ki database connection pehle se to nahi he agr he or aap bas request maarte jaa rahe ho to ye application ko choke kr sakti he

after doing connection with the database now we want another functionality in our site which is a resend email now the algorithm for the resending it looks like : 

```jsx
If (existingUserByEmail) exists then 
If (existingUserByEmail.isVerified) then
			success:fail;
			Else {
			// Save the updated user
			}
			END If
			Else {
			// Create new user and save the details
			}
			END IF
```

we have choosen the RESEND lib for this ! and also make a new folder only for the templates for the email .

And we have standardised the api response okay so whenever user will send any api response its now easy to retrieve it and we are also initialising one thing which is (isAcceptingMessages : ) this will check whether the user is accepting the message or not

and also about showcasing the messages from the database that has been sent by user .

**Making The SignUp thing :** 

```tsx
 const {username,email,password}= await request.json()
 //This line extracts the username, email,
 //and password from the incoming request body, 
 //assuming the request is sent as a JSON object.
         const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
         })
// This line queries the UserModel (which represents the users collection in your MongoDB database) 
//to find a user with the same username who is also verified (isVerified: true).
//If such a user exists, it means the username is already taken by a verified user.
         if(existingUserVerifiedByUsername) {
            return Response.json({
                success : false,
                message : "Username is already taken"
            } , 
            {
                status : 400
            })
         }
 
 //If a verified user with the same username is found, 
 //the code sends back a JSON response with a success: false message 
 //and an HTTP status code of 400 (Bad Request), indicating that the username is already taken.
```

- [ ]  NextAuthInfor
- [ ]  Otp verification and unique username check : 
here we are using a unique username from the frontend only like when i am writing a username and at a same time i am getting the message that my username is not unique okay 
so first thing we wil get it from the url so

```jsx
export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    // it will search from the url 
    const queryParamas = {
      username: searchParams.get("username"),
      // it will only take username from url
    };
    }
```

once you get the url we have to see if i am getting the username or not 
for that we have used safeparse method to get the required result , if i get it i will take my username from the data and if i not i will say the errror occured
Once you get the username from the data match it with the database if its unique or not that’s it .

### Message API and use of Aggregation Pipeline

We will talk about messages , user can toggle that if they want to accept the messages or not and also we have to check whether the messages are going or not so here we are going to write the APIs of req such GET and POST ,
and also the code for getting all the messages at a dashboard . 

Now the important thing is when i am able to toggle the messages i have to know which current user is logged in which we will get to know by tokens/sessions 

we have also integrate OpenAI APIs in it (literall copy paste hehe)

> till this if you are reading then your backend part is get completed and from here onwards now we are going to write the frontend
> 

## **React hook form, shadcn and debouncing**

> Firstly we are focusing on the functionality such as getting the username which should be unique and for that thing we are going to use the debouncing technique
> 

we have used a react hook form to create a form and also the shadcn toast component , used axios also to fetch the data from api 

when i run this i am getting the verification code and i am redirecting to the /verify in our code now we want to capture the username in the url so while making the frontend in ide we will make folder under another folder which is be like [username] (capturing ) and now story begins ahead ,