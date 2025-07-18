import express, { Router } from "express"
import protectedRoute from "../middlewares/auth.middleware.js";

import {
    friendSuggestion , 
    myfriends , 
    sendFriendRequest , 
    acceptFriendRequest ,
    getFriendRequset , 
    getOutgoingFriendRequest , 
    removeFrinedrq
} from "../controller/user.controller.js"

const router = Router() ;

router.use(protectedRoute) ;

router.get("/" , friendSuggestion)
router.get("/friend" , myfriends) 
router.get("/friend-requests" , getFriendRequset)
router.get("/outgoing-frined-request" , getOutgoingFriendRequest)

router.post("/friendrequest/:id" , sendFriendRequest) ; 
router.post("/removeFriend/:id" , removeFrinedrq) ; 
router.put("/friendrequest/:id/accept" , acceptFriendRequest) ; 



export default router