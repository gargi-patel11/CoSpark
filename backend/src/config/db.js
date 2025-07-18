import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv" 
dotenv.config() ;
const DBconnect = async()=>{
   try {
     await mongoose.connect(process.env.MONGO_URI , {})
     console.log("DataBase connected") ;
 }
    catch (error) {
    console.log("error while connecting database" , error) ; 

   }
}

export default DBconnect ; 