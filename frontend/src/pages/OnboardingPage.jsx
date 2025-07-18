import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completOnBoarding } from "../lib/api";
import { CameraIcon, LoaderIcon, ShipWheelIcon } from "lucide-react";
import { MapPinIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OnboardingPage() {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [onboardingData, setOnboardingData] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    hobbies: authUser?.hobbies || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    onBoarding: false,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: completOnBoarding,
    onSuccess: () => {
      toast.success("Onboarding Compele");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(onboardingData);
    mutate(onboardingData);
  };

  const handleGenerateAvatar = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let seed = "";
    for (let i = 0; i < 8; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const profile = `https://robohash.org/${seed}`;

    setOnboardingData({ ...onboardingData, profilePic: profile });
    toast.success("Avatar changed successfully");
  };
  return (
    <div
      className="min-h-screen bg-base-100 flex items-center justify-center p-4"
      data-theme="forest"
    >
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete your profile{" "}
          </h1>

          <form onSubmit={handlesubmit} className="space-y-4 " method="POST">
            {/* profile pic container  */}

            <div className="flex flex-col items-center justify-center space-y-4">
              {/* profile preview   */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {onboardingData.profilePic ? (
                  <img
                    src={onboardingData.profilePic}
                    alt="profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* generate random avatar */}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerateAvatar}
                  className="btn btn-accent"
                >
                  Generate random avatar{" "}
                </button>
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="fullName" className="label">
                <span className="label-text">Full Name</span>
              </label>

              <input
                name="fullName"
                id="fullName"
                value={onboardingData.fullName}
                onChange={(e) => {
                  setOnboardingData({
                    ...onboardingData,
                    fullName: e.target.value,
                  });
                }}
                className="input input-bordered  "
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="bio" className="label">
                <span className="label-text">Bio</span>
              </label>

              <textarea
                name="bio"
                id="bio"
                value={onboardingData.bio}
                onChange={(e) => {
                  setOnboardingData({ ...onboardingData, bio: e.target.value });
                }}
                className="textarea textarea-bordered h-24 "
                placeholder="Tell others about yourself and your hobbies"
              />
            </div>

            <div className="form-control">
              <label htmlFor="hobbies" className="label">
                <span className="label-text">Hobbies</span>
              </label>

              <input
                name="hobbies"
                id="hobbies"
                value={onboardingData.hobbies}
                onChange={(e) => {
                  setOnboardingData({
                    ...onboardingData,
                    hobbies: e.target.value,
                  });
                }}
                className="input input-bordered  "
                placeholder="Add your hobbies"
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="location" className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-3  right-2 size-5 z-10 text-base-content opacity-70"></MapPinIcon>

                <input
                  name="location"
                  id="location"
                  value={onboardingData.location}
                  onChange={(e) => {
                    setOnboardingData({
                      ...onboardingData,
                      location: e.target.value,
                    });
                  }}
                  className="input input-bordered absolute  w-full"
                  placeholder="City , State , Country"
                  required
                />
              </div>
            </div>

            {/* submit button */}

            <button
              className=" relative btn btn-primary w-full top-12"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete OnBoarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
        <Toaster />
      </div>
    </div>
  );
}
