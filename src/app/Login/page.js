"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AiFillWarning } from "react-icons/ai";
import Loading from "../../../components/Loading";
import toast, { Toaster } from "react-hot-toast";
import { AiOutlineMail } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";
import { AiFillEye } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { signInWithGoogle, signInWithFacebook, logInWithEmailAndPassword } from "../../../server/firebase";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signinSchema } from "../../../helpers/Form/signinSchema";


export default function Login() {
  const [loading, setLoading] = useState(false);
  const [visibility, setVisiblity] = useState(false);
  
  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values
    setLoading(true);
    try {
      await logInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error('Error registering user:', error.message);
    } finally {
      setLoading(false);
    }
    setSubmitting(false);
  };


  return (
    <div>

      <section className=" bg-slate-900">
        <motion.div
          className="flex flex-col h-screen w-11/12 md:w-full items-center justify-center px-2 py-8 mx-auto md:h-screen lg:py-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0 }}
        >
          <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-[520px] md:max-w-lg xl:p-0 bg-slate-800/50 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight md:text-2xl text-white">
                Sign In
              </h1>
              <Formik
                initialValues={initialValues}
                validationSchema={signinSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4 md:space-y-6">
                    <div className="">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Email
                      </label>
                      <div className="relative ">
                        <Field
                          id="email"
                          type="email"
                          name='email'
                          className={`${errors.email && touched.email ? 'border-cyan-600' : 'border-gray-600'
                            } outline-none border sm:text-sm rounded-lg block w-full p-2.5 bg-slate-800 focus:border-cyan-500 text-white transition duration-300`}
                          autoComplete="off"
                        />
                        <AiOutlineMail className="absolute text-xl top-3 right-2 text-gray-600" />
                        <AnimatePresence>
                          <ErrorMessage name="email" >
                            {(message) => (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.0 }}
                                className="text-cyan-400 mt-2"
                              >
                                {message}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div >
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <div className="relative ">
                        <Field
                          type={visibility ? "text" : "password"}
                          id="password"
                          name="password"
                          className={`${errors.password && touched.password ? 'border-cyan-600' : 'border-gray-600'
                            } outline-none border sm:text-sm rounded-lg block w-full p-2.5 bg-slate-800 text-white focus:border-cyan-500 transition duration-300`}
                          required
                        />
                        {visibility ? (
                          <AiFillEye
                            onClick={() => setVisiblity(!visibility)}
                            className="text-xl cursor-pointer absolute top-3 right-2 text-gray-600"
                          />
                        ) : (
                          <AiFillEyeInvisible
                            onClick={() => setVisiblity(!visibility)}
                            className="text-xl cursor-pointer absolute top-3 right-2 text-gray-600"
                            title="show password"
                          />
                        )}
                        <AnimatePresence>
                          <ErrorMessage name="password" >
                            {(message) => (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.0 }}
                                className="text-cyan-400 mt-2"
                              >
                                {message}
                              </motion.div>
                            )}
                          </ErrorMessage>
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className=" transition duration-300">
                        <span className="cursor-pointer text-gray-200 hover:text-cyan-400 font-semibold transition duration-300 text-sm">Forgot Password?</span>
                      </p>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="w-full  flex justify-center items-center gap-2 text-white duration-300 focus:ring-2 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition bg-cyan-600 hover:bg-cyan-700 "
                      >
                        {loading ? <> <Loading />Signing you in...</> : 'Sign in'}
                      </button>
                    </div>
                    <p className="text-sm text-center font-semibold text-white">
                      Didn't have an account?
                      <Link
                        href="/Register"
                        className="font-medium ml-1 hover:underline text-cyan-500"
                      >
                        Signup
                      </Link>
                    </p>
                    <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-600 after:mt-0.5 after:flex-1 after:border-t after:border-gray-600">
                      <p className="mx-4 mb-0 text-center font-semibold text-white">
                        or
                      </p>
                    </div>
                    <div className="flex flex-row flex-wrap sm:flex-nowrap gap-4 sm:gap-0 w-full ">
                      <div className="flex items-center justify-center h-[52px] w-full sm:w-1/2 ">
                        <button
                          type="button"
                          onClick={signInWithGoogle}
                          className="w-full whitespace-nowrap flex items-center justify-center transition duration-300 h-[52px] bg-slate-800 rounded-lg border border-gray-600 hover:border-cyan-500 px-6 py-2 text-sm font-medium text-white hover:bg-slate-900"
                        >
                          <FcGoogle className="text-xl" />
                          <span className="ml-2 text-sm">Sign in with Google</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-start h-[52px] w-full sm:w-1/2 ml-0 sm:ml-4">
                        <button
                          type="button"
                          onClick={signInWithFacebook}
                          className="flex whitespace-nowrap w-full items-center justify-center transition duration-300 h-[52px] bg-slate-800 rounded-lg border border-gray-600 px-6 py-2 text-sm font-medium hover:border-cyan-500 text-white hover:bg-slate-900"
                        >
                          <BsFacebook className="text-xl text-[#1778f2]" />
                          <span className="ml-2">Sign in with Facebook</span>
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
