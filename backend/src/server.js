
// // Co-create, co-chat, co-connect — all about sparking ideas together
import express from "express" 
const app = express() ;
import cors from "cors"
import cookieParser from "cookie-parser";
import DBconnect from "./config/db.js";
import dotenv from "dotenv"
import path from "path" ;
dotenv.config() ;


const __dirname = path.resolve() ;

app.use(cors({
     origin: 'http://localhost:5173',   // ✅ Use explicit origin, NOT '*'
  credentials: true  
}));
app.use(cookieParser())
app.use(express.json({limit :"16kb"}))
app.use(express.urlencoded({extended:true , limit : "16kb"}))

DBconnect() ; 


import authRoute from "../src/routers/auth.router.js"
import userRouter from "../src/routers/user.router.js"
import chatRouter from "../src/routers/chat.router.js"

app.use("/api/v1/auth" , authRoute) ; 
app.use("/api/v1/user" , userRouter) ; 
app.use("/api/v1/chat" , chatRouter) ; 

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
}

app.get("*" , (req , res)=>{
    res.sendFile(path.join(__dirname ,"../frontend" , "dist" , "index.html"))
})
const PORT= process.env.PORT|| 6000 ;
console.log(PORT);
app.listen(8000, ()=>{
    console.log("server is running at http://localhost:8000"); 
})
