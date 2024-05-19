"use client"
import { useState } from 'react'
import { motion } from "framer-motion";
import { AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../../server/firebase';
import toast from 'react-hot-toast';

export default function ResetPass() {
    const [passResetEmail, setPassResetEmail] = useState('')

    const handlePassReset = async (e) => {
        e.preventDefault()
        try {
            await sendPasswordResetEmail(auth, passResetEmail);
            setPassResetEmail("")
            toast.success("Password reset link sent check your email!")
        } catch (err) {
            toast.error(err.message)
        }
    };

    return (
        <div>
            <section className='bg-slate-900'>
                <motion.div
                    className="flex flex-col h-screen w-11/12 md:w-full items-center justify-center px-2 py-8 mx-auto md:h-screen lg:py-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0 }}
                >
                    <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-[520px] md:max-w-lg xl:p-0 bg-slate-800/50 border-gray-700">
                        <form
                            className="p-6 space-y-6 md:space-y-6 sm:p-8"
                            onSubmit={handlePassReset}
                        >
                            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Forgot password?
                            </h1>
                            <p className='text-sm text-gray-400'>Enter your email address and we will send you a link to reset your password</p>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name='email'
                                        value={passResetEmail}
                                        onChange={(e) => setPassResetEmail(e.target.value)}
                                        className={`border-gray-600 outline-none border sm:text-sm rounded-lg block w-full p-2.5 bg-slate-800 focus:border-cyan-500 text-white transition duration-300`}
                                        autoComplete="off"
                                        required
                                    />
                                    <AiOutlineMail className="absolute text-xl top-3 right-2 text-gray-600" />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <Link
                                        href="/Login"
                                    >
                                        <button
                                            type="button"
                                            className="w-[100px] p-2 bg-red-600 text-sm font-semibold transition duration-300 rounded-md hover:bg-red-700 text-white"
                                        >
                                            Cancel
                                        </button>
                                    </Link>
                                    <button
                                        type="submit"
                                        className="w-[120px] p-2 bg-cyan-600 text-sm font-semibold transition duration-300 rounded-md hover:bg-cyan-700 text-white"
                                    >
                                        Send Email
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}
