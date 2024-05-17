"use client";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../server/firebase";
import { ArrowDown, ArrowUp } from "./SvgComponents/SVG";
import { MdLogout } from "react-icons/md";

export default function User({ currentUser }) {
  const [open, setOpen] = useState(false);

  const handleLogOut = () => {
    logout()
  }


  return (
    <div>
      {open ? (
        <div onClick={() => setOpen(!open)} className="fixed inset-0 z-0"></div>
      ) : (
        ""
      )}
      <div className="absolute flex gap-6 items-center top-10 right-4 md:right-20 ">
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center justify-end px-2 transition text-sm font-medium text-white rounded-full md:mr-0 focus:ring-2 "
          type="button"
        >
          {currentUser && currentUser.photoURL ? <img src={currentUser.photoURL} alt="avatar" className="h-6 w-6 rounded-full" /> : <AiOutlineUser className="text-2xl text-cyan-600 " />}
          <span className="ml-2 text-md">{currentUser?.displayName}</span>
        </div>
        <div onClick={handleLogOut} className="cursor-pointer flex items-center gap-1 transition hover:text-cyan-500">
          <MdLogout className="text-xl"/>
          <p className="font-semibold py-1  ">
            <span
              className=" text-sm whitespace-nowrap"
            >
              Sign out
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
