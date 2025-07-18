import express, { Router } from "express"
import protectedRoute from "../middlewares/auth.middleware.js";
import {
    getStreamToken
} from "../controller/chat.controller.js"
const router = Router() ; 

router.use(protectedRoute) ; 

router.get("/token" , getStreamToken) 

export default router;