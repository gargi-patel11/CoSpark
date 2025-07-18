import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

const userschema = new Schema({
    fullName : {
        type : String , 
        requried : true 
    } , 
    email : {
        type : String , 
        requried : true ,
        unique: true 
    } , 
    password : {
        type : String , 
        requried : true , 
        maxlength : 6
    } , 
    profilePic : {
        type : String , 
        default :""  
    } , 
    bio:{
        type:String , 
        default :""
    } , 
    hobbies :{
        type:String , 
        default : ""
    }, 
    location :{
        type:String , 
        default :"" 
    } , 
    onBoarding :{
        type :Boolean , 
        default:false 
    } , 
    friends : [
        {
            type:mongoose.Schema.Types.ObjectId , 
            ref : "User" 
        }
    ]

} , {timestamps : true})

//hash password 

userschema.pre("save" ,async function(next){
    if(!this.isModified("password")) next() ; 

    this.password = await bcrypt.hash(this.password , 10) ; 
    next() ; 
} )

// get password 

userschema.methods.checkpassword  = async function (password) {
    return await bcrypt.compare(password , this.password ) ; 
}

const User = mongoose.model("User" , userschema) ; 

export default User ; 