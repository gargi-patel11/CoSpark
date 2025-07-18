import React, { useEffect, useState } from 'react'
import {useParams} from "react-router"
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader"
import CallButton from '../components/CallButton';

const API_KEY = import.meta.env.VITE_API_KEY_STREAM ;

export default function ChatPage() {
  const {id : targetUserId} = useParams() ;
  console.log(targetUserId) ;

  const [chatClient , setChatClient] = useState(null)
  const [chatChannel , setChatChannel] = useState(null)
  const [channel , setChannel] = useState(null)
  const [loading , setLoading] = useState(true)

  const {authUser} = useAuthUser() ; 

  const {data : tokenData} = useQuery({
    queryKey :["streamToken"] , 
    queryFn : getStreamToken ,
    enabled : !!authUser //this will run only when auth user is available 
  })

  const handleVideoCall = ()=>{
     if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  }

  useEffect(()=>{
    const initchat= async()=>{
      if(!tokenData?.token || !authUser) return 

      try {
        console.log("initialization stream chat")

        const client = StreamChat.getInstance(API_KEY)

        await client.connectUser({
          id:authUser._id , 
          name : authUser.fullName , 
          image : authUser.profilePic 
        }, tokenData.token)

        const channelId = [authUser._id , targetUserId].sort().join("-")

        const currChannel = client.channel("messaging" , channelId , {
          members :[authUser._id , targetUserId] 
        })

        await currChannel.watch() ;

        setChatClient(client) 
        setChannel(currChannel) 

      } catch (error) {
        console.log(error) ;
        toast.error("could not connect chat,Please try again! ")
      }
      finally{
        setLoading(false) ;
      }
    }
    initchat() ;
  },[tokenData , authUser , targetUserId])

  // const {theme} = localStorage.getItem(theme); 

  if(loading ||!chatClient || !channel) return <ChatLoader />
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel} >
          <div className='w-full relative'>
            <CallButton handleVideoCall  ={handleVideoCall} />
             <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}
