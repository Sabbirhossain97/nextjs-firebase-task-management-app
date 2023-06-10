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
      <div className="flex flex-col">
        <div className="flex flex-row absolute top-10 right-20  justify-center  ">
          <div
            onClick={() => setOpen(!open)}
            className=" cursor-pointer transition border-gray-700 rounded-full p-1"
          >
            <AiOutlineUser className="text-3xl text-cyan-600" />
          </div>
          <div className="flex flex-col items-center justify-center text-sm ml-1">
            <p className="text-sm">{user?.data.name}</p>
          </div>
        </div>
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              transition={{ delay: 0.0 }}
              className="absolute bg-slate-800 z-10 top-20 right-44  divide-y divide-gray-100 rounded-lg shadow w-44 "
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <p className="font-semibold px-4 py-1 transition hover:text-cyan-500 ">
                    <span
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      Sign out
                    </span>
                  </p>
                </li>
              </ul>
            </motion.div>
          ) : (
            ""
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
