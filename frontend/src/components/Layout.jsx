import React, { Children } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ activeSidebar = true, children }) {
  return (
    <div className="min-h-screen">
      <div className="flex ">
        {activeSidebar && <Sidebar />}
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto ">{children}</main>
        </div>
      </div>
    </div>
  );
}
