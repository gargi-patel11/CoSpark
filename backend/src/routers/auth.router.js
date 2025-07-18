import express from "express"
import { Router } from "express"
import protectedRoute from "../middlewares/auth.middleware.js";
import { registeruser , 
    loginuser, 
    logoutuser, 
    onboard
 } from "../controller/auth.controller.js";

const router = Router() ; 

router.post("/register" , registeruser)
router.post("/login" , loginuser)
router.post("/logout" , logoutuser)
router.post("/onboarding" ,protectedRoute, onboard)

router.get("/me",protectedRoute , (req , res)=>{
    res.status(200).json({success:true , user : req.user})
})

export default router ; 