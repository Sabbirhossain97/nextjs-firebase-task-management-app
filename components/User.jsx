"use client";
import React from "react";
import { logout } from "../server/firebase";
import { MdLogout } from "react-icons/md";

export default function User() {

  const handleLogOut = () => {
    logout()
  }

  return (
    <div className="absolute flex gap-6 items-center top-8 right-4 md:right-20">
      <div onClick={handleLogOut} className="cursor-pointer flex items-center gap-1 transition hover:text-cyan-500">
        <MdLogout className="text-xl text-cyan-400" />
        <p className="font-semibold py-1  ">
          <span
            className=" text-sm whitespace-nowrap"
          >
            Sign out
          </span>
        </p>
      </div>
    </div>
  );
}
