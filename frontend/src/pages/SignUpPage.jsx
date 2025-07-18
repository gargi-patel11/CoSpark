import React, { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query"
import { axiosInstance } from "../lib/AxiosInstance";
export default function SignUpPage() {
  const [signUpData , setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate() ;

  const queryClient = useQueryClient(); 
  const {mutate , isPending ,error} = useMutation({
    mutationFn : async()=>{
      const response = await axiosInstance.post("/auth/register" , signUpData) 
      console.log(response);
      return response.data ;
    } , 
    onSuccess : ()=>{queryClient.invalidateQueries({queryKey:["authUser"]}) } , 
     onError : ()=>{toast.error(error?.response?.data?.message)}
  })
  const handleSignUp = async (e) => {
    e.preventDefault();
    mutate() ; 
  };
  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 "
      data-theme="forest"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shdow-lg overflow-hidden ">
        {/* //left side  */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* //logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className="size-9" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-t from-primary to-secondary tracking-wider ">
              CoSpark
            </span>
          </div>
          {/* { error && (
          <div className="alert alert-error mb-4">
            <span>{error.response.data.message}</span>
          </div>
          )} */}
          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account </h2>
                  <p className="text-sm opacity-70">
                    join CoSpark to co-relate
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label htmlFor="fullName" className="label">
                      <span className="label-text">Full Name</span>
                    </label>

                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) => {
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        });
                      }}
                      name="fullName"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label htmlFor="email" className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={signUpData.email}
                      onChange={(e) => {
                        setSignUpData({
                          ...signUpData,
                          email: e.target.value,
                        });
                      }}
                      name="email"
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label htmlFor="password" className="label">
                      <span className="label-text">Password</span>
                    </label>

                    <input
                      type="password"
                      className="input input-bordered w-full"
                      value={signUpData.password}
                      onChange={(e) => {
                        setSignUpData({
                          ...signUpData,
                          password: e.target.value,
                        });
                      }}
                      name="password"
                      required
                    />
                    <p className="text-sm opacity-70 pt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm "
                        required
                      />
                      <span className="text-sm leading-tight">
                        I agree to the{" "}
                      </span>
                      <span className="text-primary hover:underline">
                        terms of service
                      </span>{" "}
                      ans{" "}
                      <span className="text-primary hover:underline">
                        privacy policy
                      </span>
                    </label>
                  </div>
                </div>
                <button className="btn btn-primary w-full " type="submit">
                  {isPending ? (<div className="loading loading-spinner loading-xm">loading...</div>) : ("Create account")}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account{" "}
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in{" "}
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/Chatting-pana.png"
                alt="Language connection illustration"
                className="w-full h-full"
              />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Meet people who share your passions
              </h2>
              <p className="opacity-70">
                Discover new hobbies, connect, and grow your interests together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
