import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriends, sendFriendRequest } from "../lib/api";
import { getRecommendedFriends, getoutGoingFrined } from "../lib/api";
import { Link } from "react-router-dom";
import { UsersIcon } from "lucide-react";
import NoFriendsFound from "../components/NoFrinedsFound";
import { MapPinIcon , UserPlusIcon , CheckCircleIcon} from "lucide-react";
import { removefrd } from "../lib/api";
import FriendCard from "../components/FriendCard"; 


export default function HomePage() {
  const queryClient = useQueryClient();

const { data: friends = [], isLoading: frinedLoading } = useQuery({
  queryKey: ["friends"],
  queryFn: getFriends,
});

const { data: recommendedUsers = [], isLoading: userLoading } = useQuery({
  queryKey: ["recommendedfriends"],
  queryFn: getRecommendedFriends,
});

const { data: outGoingFrinedrqdata = [], refetch: refetchOutgoing } = useQuery({
  queryKey: ["outGoingFrinedrq"],
  queryFn: getoutGoingFrined,
});

// ✅ NO useState, NO useEffect — derive directly:
const outGoingReqId = outGoingFrinedrqdata.map((req) => req.recipient._id);

const { mutate, isPending, error } = useMutation({
  mutationFn: sendFriendRequest,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["outGoingFrinedrq"] });
    refetchOutgoing();
  },
  onError: () => {
    toast.error(error?.response?.data?.message);
  },
});



  return (
    <div className="p-4 sm:p-6 lg:p-8 h-full">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notification" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {frinedLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : friends.friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.friends.map((friend) => {
              return <FriendCard key={friend._id} friend={friend} />;
            })}
          </div>
        )}

        {/* recommneded  frineds  */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Meet new friends
                </h2>
                <p className="opacity-70">
                  Discover your hobby buddy! share experience and get knowledge
                </p>
              </div>
            </div>
          </div>

          {userLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">
                No recommended User found
              </h3>
              <p className="text-base-content opacity-70">
                Check back for new hobby buddy
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedUsers.suggesteduser.map((User) => {
              

                const requestHasBeenSent = outGoingReqId.includes(User._id)
               
                return (
                  <div
                    key={User._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={User.profilePic} alt={User.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">
                            {User.fullName}
                          </h3>
                          {User.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {User.location}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-lg">{User.hobbies}</div>
                    </div>

                    <button
                      className={`btn mx-3 mb-3 mt-2  ${
                        requestHasBeenSent ? "btn-disabled" : "btn-primary"
                      } `}
                      onClick={() => {mutate(User._id)}}
                      disabled={requestHasBeenSent || isPending}
                    >
                      {requestHasBeenSent ? (
                        <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
