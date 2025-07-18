import {StreamChat} from "stream-chat"
import "dotenv/config"

const apikey = process.env.API_KEY_STREAM 
const apisecret = process.env.API_SECRET_STREAM 

if(!apikey || !apisecret){
     console.error("api ket and secret is not valid")
    throw new Error("API key and secret are required for Stream client.");
   
}

const streamClient = StreamChat.getInstance(apikey , apisecret)

export const upsertStreamUser = async(userData)=>{
    try {
        const response = await streamClient.upsertUsers([userData])
        console.log("stream user" , response);
        return userData;
    } catch (error) {
        console.error("error upserting stream user " , error )
    }
}

export const  generateStreamToken = (userId)=>{
    try {
        const useridstr = userId.toString()  ; 
        return streamClient.createToken(useridstr) ;
    } catch (error) {
        console.log("error og generating stream token")
    }
}