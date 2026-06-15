import mongoose from "mongoose" 
import dotenv from "dotenv"
 export const conectDB = async ()=>{ 
     try {
      const conn =  await mongoose.connect(process.env.MONGO_DB)  
 console.log("connected to Mongo Db")
     } catch (error) {
console.log('error connecting to DB')    
}

}

