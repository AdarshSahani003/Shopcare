
import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"


const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect
        (`${process.env.MONGODB_URI}/${DB_NAME}`)

       



        
        console.log("MONGODB Connected")
    }catch(err){
        console.log("MONGODDB connection Failed", err)
        process.exit(1)
    }
}
export default connectDB