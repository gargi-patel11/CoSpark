import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useLocation } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/AxiosInstance";
import { PaletteIcon, ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";
import { BellIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { LogOutIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatpage = location.pathname?.startsWith("/chat");
  const queryclient = useQueryClient();

  const changeTheme = () => {
    if (theme === "cupcake") setTheme("dark");
    else setTheme("cupcake");
  };
  const { mutate: logoutMutation } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/logout");
      return response.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full gap-3">
          {/* logo if were in chat page  */}

            {isChatpage && (
              <div className="pl-5 ">
                <Link to="/" className="flex justify-start gap-2.5 ">
                  <ShipWheelIcon className="size-9 text-primary" />
                  <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                    CoSpark
                  </span>
                </Link>
              </div>
            )}
        

          <div className="flex gap-3 sm:gap-4 items-center ml-auto">
            <Link to={"/notification"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

          {/* ToDo */}
          <div className="flex gap-3 sm:gap-4 items-center ">
            <button onClick={changeTheme} className="btn btn-ghost btn-circle">
              <PaletteIcon />
            </button>
          </div>

          {theme === "cupcake"}
          <div className="avatar">
            <div className="w-9 rounded-full">
              <img
                src={authUser?.profilePic}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          {/* Logout button */}

          {/* Put this part before </body> tag */}
          {/* Open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
          <dialog id="my_modal_2" className="modal ">
            <div className="modal-box absolute">
              <p className="py-4">Are you sure you want to log out</p>
              <button onClick={logoutMutation} className="btn bg-red-400">
                Log out
              </button>
            </div>

            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>

          {/* <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            
          </button> */}
        </div>
      </div>
    </nav>
  );
}
