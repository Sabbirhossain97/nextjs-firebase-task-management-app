"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillWarning } from "react-icons/ai";
import Loading from "../../../components/Loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios
        .post(
          "/api/signin",
          {
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
  };

  useEffect(() => {
    if (message?.data.status === 400) {
      setTimeout(() => {
        setError(message?.data.message);
      }, 1000);
    } else if (message?.data.status === 404) {
      setTimeout(() => {
        setError(message?.data.message);
      }, 1000);
      console.log(message);
    } else if (message?.data.status === 200) {
      localStorage.setItem("token", message?.data.token);
      router.push("/Home");
    }
  }, [message]);

  return (
    <div>
      <section className=" bg-slate-900">
        <div className="flex flex-col h-screen w-10/12 md:w-full items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-slate-800/50 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign In
              </h1>
              <div className="space-y-4 md:space-y-6">
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
                    className=" border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-slate-800 border-gray-600 placeholder-gray-700 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setEmail(e.target.value)}
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
                    className={`border text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-slate-800 border-gray-600
                     dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
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
                      className="mt-1 text-sm text-center border border-red-500 text-red-600 flex flex-row justify-center w-full rounded-md  p-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.0 }}
                    >
                      <AiFillWarning className="mt-0.5 " />{" "}
                      <span className="ml-1">{error}</span>
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
                  {loading ? <Loading /> : "Sign in"}
                </button>
                <ToastContainer />
                <p className="text-sm text-center font-semibold text-gray-500 dark:text-gray-400">
                  Didn't have an account?
                  <Link
                    href="/Register"
                    className="font-medium ml-1 text-primary-600 hover:underline text-cyan-500"
                  >
                    Signup
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
