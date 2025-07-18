import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ShipWheelIcon } from 'lucide-react';
import { Link } from 'react-router';
import { axiosInstance } from '../lib/AxiosInstance';

export default function LoginPage() {
   const [loginData , setloginData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate() ;

  const queryClient = useQueryClient(); 
  const {mutate , isPending } = useMutation({
    mutationFn : async()=>{
      const response = await axiosInstance.post("/auth/login" , loginData) 
      console.log(response);
      return response.data ;
    } , 
    onSuccess : ()=>{queryClient.invalidateQueries({queryKey:["authUser"]}) }, 
    onError : (error)=>{toast.error(error.response?.data?.message)}
  
  })
  const handlelogin = async (e) => {
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
            <span>{error.response?.data?.message}</span>
          </div>
          )} */}
          <div className="w-full">
            <form onSubmit={handlelogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold"></h2>
                  <p className="text-sm opacity-70">
                    join CoSpark to co-relate
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="form-control w-full">
                    <label htmlFor="email" className="label">
                      <span className="label-text">Email</span>
                    </label>

                    <input
                      type="email"
                      className="input input-bordered w-full"
                      value={loginData.email}
                      onChange={(e) => {
                        setloginData({
                          ...loginData,
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
                      value={loginData.password}
                      onChange={(e) => {
                        setloginData({
                          ...loginData,
                          password: e.target.value,
                        });
                      }}
                      name="password"
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-primary w-full " type="submit">
                  {isPending ? (<div className="loading loading-spinner loading-xm">loading...</div>) : ("Login")}
                </button>
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Don't have account{" "}
                    <Link to="/signUp" className="text-primary hover:underline">
                      Sign Up{" "}
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
  )
}
