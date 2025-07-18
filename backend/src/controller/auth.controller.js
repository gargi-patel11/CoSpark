import express from "express";
import User from "../models/User.models.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { upsertStreamUser } from "../config/stream.js";
dotenv.config();

const registeruser = async(req , res)=>{
    const {fullName , email , password} = req.body 
     if(!fullName || !email || !password ){
        return res.status(400).json({
            message:"fullname email and password are requried "
        })
    }

    if(password.length < 6){
        return res.status(400).json({
            message:"password must have more than 6 laters"
        })
    }

    const validemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!validemail.test(email)){
        return res.status(400).json({
            message:"Email should be in coreect formate "

        })
    }
    

    const user =await User.findOne({email});
    if(user){
        return res.status(400).json({
            message:"This email is already used, Please try with another one"
        })
    }
      console.log(fullName);
    console.log(email);
    console.log(password);
    const index = Math.floor(Math.random()*100)+1 
    const profilePic = `https://avatar.iran.liara.run/public/${index}`

    

    const createdUser = await User.create({
        fullName , 
        email , 
        password , 
        profilePic : profilePic 
    })
   

    if(!createdUser){
        return res.status(500).json({
            message:"Server error! please try again later"
        })
    }

    //creating user in strem as well

    try {
        await upsertStreamUser({
            id:createdUser._id.toString() , 
            name : createdUser.fullName , 
            image : createdUser.profilePic || "" 
        })
        console.log("strem user created " , createdUser.fullName);
    } catch (error) {
        console.error("error creating strem user " , error) ;
    }

    const token = jwt.sign({_id : createdUser._id} , process.env.TOKEN_SECRET ,{expiresIn: "1d"}) 

    res.cookie("jwt" , token , {
        maxAge : 7 * 24* 60*60 *1000, 
        httpOnly: true , // prevent XSS attack 
        sameSite:"strict" ,// prevent CSRF attack
        secure:process.env.NODE_ENV === "production"
       })
       console.log("compelete");

    res.status(201).json({
        message:"user created successfully ",
        user : createdUser

    })
}

const loginuser = async(req , res)=>{
     const {email , password}= req.body;
    
    if(!email || !password) {
        return res.status(400).json({
            message:"email or password requried"
        })
    }
    
    try{

        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"Invaild email"
            })
        }

        const ispasswordcorrect = await user.checkpassword(password);
        if(!ispasswordcorrect){
            return res.status(400).json({
                message:"Invaild password"
            })
        }

        const token = jwt.sign({_id : user._id} , process.env.TOKEN_SECRET ,{expiresIn: "1d"}) 

        res.cookie("jwt" , token , {
            maxAge : 7 * 24* 60*60 *1000, 
            httpOnly: true , // prevent XSS attack 
            sameSite:"strict" ,// prevent CSRF attack
            secure:process.env.NODE_ENV === "production"
        })

        res.status(201).json({
            message:"user login successfully ",
            user : user,
            token : token
    })


    }catch(error){
        
        console.log("something went wrong " , error) ; 
        return res.status(500).json({
            message : error
        })
    }
}

const logoutuser = async(req, res)=>{
    res.clearCookie("jwt"); 
    res.status(200).json({message:"User logged out"})
}

const onboard = async(req, res)=>{
    const userId = req.user._id ; 
    console.log("here")
    try {
        const {fullName , bio , hobbies , location }= req.body
    
        if(!fullName || !bio || !hobbies || !location){
            return res.status(400).json({
                message : "All fields are requried" 
            })
        }
        console.log("herw");
    
        const updatedUser =await User.findByIdAndUpdate(userId , {
            ...req.body , 
            onBoarding : true 
        }, {new:true})
    
        if(!updatedUser) {
            return res.status(400).json({
                message : "User not found" 
            })
        }
        console.log(updatedUser)
        //update user at stream user 
    
        try {
            const response = await upsertStreamUser({
                id:updatedUser._id.toString(), 
                name : updatedUser.fullName , 
                image:updatedUser.profilePic ||"" 
            })
            console.log("updated user in stream" , response)
        } catch (error) {
            console.log("error while updatating user in stream " , error)
        }
        console.log("onboarded")
        res.status(200).json({
            message:"onBoarding successfully " , 
            user:updatedUser
        })
    } catch (error) {
        res.status(500).json({
            message :"onboarding server error" 
        })
    }
}


export {
    registeruser , 
    loginuser,
    logoutuser , 
    onboard
}