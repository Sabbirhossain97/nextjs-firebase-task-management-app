"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../../components/Loading";
import { AiFillWarning } from "react-icons/ai";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name | email | (password === "")) {
      return;
    } else {
      try {
        setLoading(true);
        await axios
          .post(
            "/api/register",
            {
              name: name,
              email: email,
              password: password,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((data) => setMessage(data))
          .catch((err) => console.log(err));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (message?.data === 200) {
      toast.success("Registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        toastId: "success1",
      });
      router.push("/Login");
    } else if (message?.data === 404) {
      setTimeout(() => {
        setError("Email already exists!");
      }, 1000);
    }
  }, [message]);

  return (
    <div>
      <section className=" bg-slate-900">
        <motion.div
          className="flex flex-col h-screen w-10/12 md:w-full items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
          initial={{ opacity: 0}}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0}}
          transition={{ delay: 0.25 }}
        >
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800/50 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up
              </h1>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    className=" border border-gray-300 text-gray-500 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-slate-800 dark:border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="john doe"
                    required
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="johndoe@gmail.com"
                    className={`border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-slate-800 border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    placeholder="••••••••"
                    className={`border  text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-slate-800  border-gray-600 dark:placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                </div>
                <AnimatePresence>
                  {error ? (
                    <motion.p
                      className="mt-1 text-sm text-center border border-red-500 text-red-600 flex flex-row justify-center w-full rounded-md p-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.25 }}
                    >
                      <AiFillWarning className="mt-0.5 " />{" "}
                      <span className="ml-1">Email already exists!</span>
                    </motion.p>
                  ) : (
                    ""
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition bg-cyan-600 hover:bg-cyan-700 dark:focus:ring-primary-800"
                  onClick={handleSubmit}
                >
                  {loading ? <Loading /> : "Create an account"}
                </button>
                <ToastContainer />
                <p className="text-sm text-center font-semibold text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/Login"
                    className="font-medium text-primary-600 hover:underline text-cyan-500"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
