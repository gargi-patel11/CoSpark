import { axiosInstance } from "./AxiosInstance";

export const getAuthUser= async()=> {
          try {
            const res = await axiosInstance.get("/auth/me") ; 
            return res.data 
          } catch (error) {
            console.log("error in getAuthUser" , error)
            return null ; 
          }
}

export const completOnBoarding = async(onboardingdata)=>{

    const response = await axiosInstance.post("/auth/onboarding" , onboardingdata) ;
    return response.data 
}

export const getFriends = async()=>{

    const response = await axiosInstance.get("/user/friend" ) ;
    return response.data 
}

export const getRecommendedFriends = async()=>{

    const response = await axiosInstance.get("/user/" ) ;
    return response.data 
}


export const getoutGoingFrined = async()=>{

    const response = await axiosInstance.get("/user/outgoing-frined-request" ) ;
    return response.data 
}

export const sendFriendRequest = async(UserId)=>{
    const response = await axiosInstance.post(`/user/friendrequest/${UserId}` ) ;
    return response.data 
}

export const removefrd = async(UserId) =>{
   const response = await axiosInstance.post(`/user/removeFrinedrq/${UserId}` ) ;
    return response.data 
}

export const getFriendRequests = async()=>{
    const response = await axiosInstance.get("/user/friend-requests") 
    return response.data ;
}

export const acceptFriendRequest= async(requestId) =>{
    const response = await axiosInstance.put(`/user/friendrequest/${requestId}/accept`)

    return response.data
}

export const getStreamToken= async() =>{
    const response = await axiosInstance.get("/chat/token")

    return response.data
}


