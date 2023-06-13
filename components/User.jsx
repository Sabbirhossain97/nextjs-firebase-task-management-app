"use client";
import React, { useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function User({ user }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.clear();
    Cookies.remove("isLoggedIn");
    router.push("/Login");
  };

  return (
    <div>
      {open ? (
        <div onClick={() => setOpen(!open)} className="fixed inset-0 z-0"></div>
      ) : (
        ""
      )}
      <div className="absolute top-10 right-4 md:right-20 ">
        <div
          onClick={() => setOpen(!open)}
          className="cursor-pointer flex items-center justify-end px-2 transition text-sm font-medium text-gray-900 rounded-full hover:text-cyan-600  md:mr-0 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-white"
          type="button"
        >
          <AiOutlineUser className="text-2xl text-cyan-600 " />
          <span className="ml-2 text-md">{user?.data.name}</span>
          {open ? (
            <svg
              className="w-4 h-4 mx-1.5 "
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mx-1.5 "
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              className="z-10 absolute right-4 mt-2 bg-slate-800 divide-y divide-gray-100 rounded-lg shadow w-10/12  dark:divide-gray-600"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ delay: 0.2 }}
            >
              <div className="py-1">
                <p className="font-semibold px-4 py-1 transition hover:text-cyan-500 ">
                  <span
                    onClick={handleSignOut}
                    className="cursor-pointer text-sm"
                  >
                    Sign out
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
