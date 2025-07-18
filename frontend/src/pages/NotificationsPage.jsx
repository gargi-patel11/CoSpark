import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFriendRequests  ,acceptFriendRequest , getFriends} from '../lib/api';
import { UserCheckIcon } from 'lucide-react';


import React from 'react'

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const {data:friendRequests , isLoading} = useQuery({
    queryKey:["friendRequests"] , 
    queryFn : getFriendRequests 

  })

  const {mutate:acceptRequestMutation, isPending} = useMutation({
    mutationFn : acceptFriendRequest , 
    onSuccess : ()=>{
      queryClient.invalidateQueries({queryKey:["friendRequests"]})
      queryClient.invalidateQueries({queryKey:["friends"]})

      // getFriendRequests() ; 
      // getFriends()
    }

  })

  const incomingRequest = friendRequests?.penddingreq
 || []

  console.log(friendRequests)
  const acceptedRequset = friendRequests?.acceptedreq
 || []

  console.log(acceptedRequset) ;


  return (
    <div className='p-4 sm:p-6 lg:p-8'>
       <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

      {isLoading ?(
        <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
      ):(
        <>
          {incomingRequest.length> 0 ?(
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequest.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequest.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar w-14 h-14 rounded-full bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className="badge badge-secondary badge-sm">
                                  {request.sender.hobbies}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={isPending}
                          >
                            Accept
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              
          ) :(
            <div className='pt-5 '>
              <p className='text-center opacity-60 '>
                You have not any notification Right Now
              </p>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  )
}
