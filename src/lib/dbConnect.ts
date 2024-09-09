import mongoose, { Connection } from "mongoose";

// when we get connection from database and after we get connection from a database we should know what type of data from an object is coming

type ConnectionObject = {
    isConnected ?: number
}

const connection : ConnectionObject = {}
// we will initially keep it empty and that's reason we kept above the optional 

async function dbConnect() :Promise<void> {
    // please don't bring baggage with the void in other programming languages such as cpp or java void means it doesn't have any value but here we means that we don't care about what type of promises it is going to  get return .

    if(connection.isConnected) {
        console.log("Already connected to database !");
        return;    
    }

    try {
       const db =  await mongoose.connect(process.env.MONGODB_URI || '' , {})
       console.log(db);
       
       connection.isConnected = db.connections[0].readyState

       console.log("DB is connected successfully !");
       
    } catch (error) {
        console.log("DB connection failed",error);
        
        process.exit();
    }
    
}
export default dbConnect;