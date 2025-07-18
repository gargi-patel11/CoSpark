import express from "express"
import jwt from "jsonwebtoken"
import "dotenv/config"
import User from "../models/User.models.js"

 const protectedRoute = async (req , res , next )=>{

    try {
        const token =  req.cookies?.jwt ||req.header("Authorization")?.replace(/bearer/i , "").trim()
        if(!token){
            return res.status(401).json({
                message :"Token is not valid "
            })
        }

        const decodedToken = jwt.verify(token , process.env.TOKEN_SECRET) ; 
        if(!decodedToken){
            return res.status(401).json({
                message :"Token is not valid "
            })
        }
        const user =await User.findById(decodedToken._id).select("-password")

        req.user = user ;
        next()
    } catch (error) {
        res.status(500).json({
            message:"protected route error" , error 
        })
    }

}
export default protectedRoute ; 