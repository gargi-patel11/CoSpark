import { generateStreamToken } from "../config/stream.js"

export const getStreamToken = async(req , res)=>{
    try {
        const token = await generateStreamToken(req.user._id)
        res.status(200).json({token}) 
    } catch (error) {
        res.status(500).json({
            message :"internal server error while getting stream token", error 
        })
    }
}