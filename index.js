import dotenv from "dotenv"
import connectDB from "./src/db/index.js";
import { app } from "./app.js"; 

dotenv.config({
    path: "./.env"
})


connectDB()
.then(() => {
   app.listen(process.env.PORT || 4000, () => {
    console.log("Server is RUnning at port",process.env.PORT);
   }) 
})
.catch((err) => {
    console.log("MOngo DB connection Failed", err);
    
})