"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "./common/header";
import { Toaster } from "react-hot-toast";
import useAuth from "../../helpers/hooks/useAuth";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const user = useAuth()
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <title>Todo</title>
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
